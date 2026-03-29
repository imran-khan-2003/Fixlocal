
package com.fixlocal.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.fixlocal.dto.DisputeDetailsDTO;
import com.fixlocal.dto.DisputeMessageRequest;
import com.fixlocal.dto.DisputeRequest;
import com.fixlocal.exception.ResourceNotFoundException;
import com.fixlocal.exception.UnauthorizedException;
import com.fixlocal.model.Booking;
import com.fixlocal.model.Dispute;
import com.fixlocal.model.Role;
import com.fixlocal.model.User;
import com.fixlocal.repository.BookingRepository;
import com.fixlocal.repository.DisputeRepository;
import com.fixlocal.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public Dispute createDispute(DisputeRequest request, Authentication authentication) {
        User reporter;
        if (request.getReporterId() != null) {
            reporter = userRepository.findById(request.getReporterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reporter not found"));
        } else {
            reporter = getAuthenticatedUser(authentication);
        }

        Dispute dispute = Dispute.builder()
                .bookingId(request.getBookingId())
                .reporterId(reporter.getId())
                .reason(request.getReason())
                .desiredOutcome(request.getDesiredOutcome())
                .build();

        return disputeRepository.save(dispute);
    }

    public List<DisputeDetailsDTO> getAllDisputesWithDetails() {
        Map<String, User> userCache = new HashMap<>();
        Map<String, Booking> bookingCache = new HashMap<>();

        return disputeRepository.findAll()
                .stream()
                .map(dispute -> mapToDetails(dispute, userCache, bookingCache))
                .collect(Collectors.toList());
    }

    public DisputeDetailsDTO getDisputeDetails(String id, Authentication authentication) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));

        User requester = getAuthenticatedUser(authentication);

        if (!isAdmin(requester) && !isParticipant(requester.getId(), dispute)) {
            throw new UnauthorizedException("Not authorized to view this dispute");
        }

        return mapToDetails(dispute, new HashMap<>(), new HashMap<>());
    }

    public List<Dispute> getDisputesByBookingId(String bookingId) {
        return disputeRepository.findByBookingId(bookingId);
    }

    public List<DisputeDetailsDTO> getDisputesForReporter(Authentication authentication) {
        User reporter = getAuthenticatedUser(authentication);

        Map<String, User> userCache = new HashMap<>();
        Map<String, Booking> bookingCache = new HashMap<>();

        return disputeRepository.findByReporterId(reporter.getId())
                .stream()
                .map(dispute -> mapToDetails(dispute, userCache, bookingCache))
                .collect(Collectors.toList());
    }

    public DisputeDetailsDTO updateDispute(String id, Dispute updatedDispute, Authentication authentication) {
        Dispute existingDispute = disputeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));

        User requester = getAuthenticatedUser(authentication);

        if (!isAdmin(requester) && !requester.getId().equals(existingDispute.getReporterId())) {
            throw new UnauthorizedException("Only admins or the reporter can update disputes");
        }

        if (updatedDispute.getStatus() != null) {
            existingDispute.setStatus(updatedDispute.getStatus());
        }

        if (updatedDispute.getDesiredOutcome() != null) {
            existingDispute.setDesiredOutcome(updatedDispute.getDesiredOutcome());
        }

        Dispute saved = disputeRepository.save(existingDispute);
        return mapToDetails(saved, new HashMap<>(), new HashMap<>());
    }

    public Dispute addMessage(String disputeId,
                              Authentication authentication,
                              DisputeMessageRequest request) {

        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found"));

        User sender = getAuthenticatedUser(authentication);

        if (!isAdmin(sender) && !isParticipant(sender.getId(), dispute)) {
            throw new UnauthorizedException("Not authorized to add message to this dispute");
        }

        if (dispute.getMessages() == null) {
            dispute.setMessages(new ArrayList<>());
        }

        dispute.getMessages().add(
                Dispute.DisputeMessage.builder()
                        .senderId(sender.getId())
                        .message(request.getMessage())
                        .build()
        );

        return disputeRepository.save(dispute);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) {
            throw new UnauthorizedException("Authentication required");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isAdmin(User user) {
        return user != null && user.getRole() == Role.ADMIN;
    }

    private boolean isParticipant(String userId, Dispute dispute) {
        if (userId == null || dispute == null) {
            return false;
        }
        if (userId.equals(dispute.getReporterId())) {
            return true;
        }
        return bookingRepository.findById(dispute.getBookingId())
                .map(booking -> userId.equals(booking.getUserId()) || userId.equals(booking.getTradespersonId()))
                .orElse(false);
    }

    private DisputeDetailsDTO mapToDetails(Dispute dispute,
                                           Map<String, User> userCache,
                                           Map<String, Booking> bookingCache) {

        User reporter = resolveUser(dispute.getReporterId(), userCache);
        Booking booking = resolveBooking(dispute.getBookingId(), bookingCache);
        User respondent = resolveRespondent(dispute, booking, reporter, userCache);

        List<DisputeDetailsDTO.MessageDTO> messageDTOS = buildMessageDTOs(dispute, userCache);

        return DisputeDetailsDTO.builder()
                .id(dispute.getId())
                .bookingId(dispute.getBookingId())
                .reason(dispute.getReason())
                .desiredOutcome(dispute.getDesiredOutcome())
                .status(dispute.getStatus())
                .createdAt(dispute.getCreatedAt())
                .reporter(toUserSummary(reporter))
                .respondent(toUserSummary(respondent))
                .booking(toBookingSummary(booking, userCache))
                .messages(messageDTOS)
                .build();
    }

    private List<DisputeDetailsDTO.MessageDTO> buildMessageDTOs(Dispute dispute,
                                                                Map<String, User> userCache) {
        List<Dispute.DisputeMessage> sourceMessages = dispute.getMessages();
        if (sourceMessages == null || sourceMessages.isEmpty()) {
            return new ArrayList<>();
        }

        return sourceMessages.stream()
                .map(msg -> {
                    User sender = resolveUser(msg.getSenderId(), userCache);
                    return DisputeDetailsDTO.MessageDTO.builder()
                            .senderId(msg.getSenderId())
                            .senderName(sender != null ? sender.getName() : "Unknown")
                            .senderRole(sender != null && sender.getRole() != null
                                    ? sender.getRole().name()
                                    : null)
                            .message(msg.getMessage())
                            .timestamp(msg.getTimestamp())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private Booking resolveBooking(String bookingId, Map<String, Booking> cache) {
        if (bookingId == null) {
            return null;
        }
        if (cache.containsKey(bookingId)) {
            return cache.get(bookingId);
        }
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        cache.put(bookingId, booking);
        return booking;
    }

    private User resolveUser(String userId, Map<String, User> cache) {
        if (userId == null) {
            return null;
        }
        if (cache.containsKey(userId)) {
            return cache.get(userId);
        }
        User user = userRepository.findById(userId).orElse(null);
        cache.put(userId, user);
        return user;
    }

    private User resolveRespondent(Dispute dispute,
                                   Booking booking,
                                   User reporter,
                                   Map<String, User> cache) {
        if (booking == null) {
            return null;
        }

        String reporterId = dispute.getReporterId();
        if (reporter != null) {
            if (reporter.getId().equals(booking.getUserId())) {
                return resolveUser(booking.getTradespersonId(), cache);
            }
            if (reporter.getId().equals(booking.getTradespersonId())) {
                return resolveUser(booking.getUserId(), cache);
            }
        }

        if (reporterId != null && reporterId.equals(booking.getUserId())) {
            return resolveUser(booking.getTradespersonId(), cache);
        }

        if (reporterId != null && reporterId.equals(booking.getTradespersonId())) {
            return resolveUser(booking.getUserId(), cache);
        }

        return null;
    }

    private DisputeDetailsDTO.UserSummary toUserSummary(User user) {
        if (user == null) {
            return null;
        }

        return DisputeDetailsDTO.UserSummary.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    private DisputeDetailsDTO.BookingSummary toBookingSummary(Booking booking,
                                                              Map<String, User> userCache) {
        if (booking == null) {
            return null;
        }

        User tradesperson = resolveUser(booking.getTradespersonId(), userCache);
        User user = resolveUser(booking.getUserId(), userCache);

        return DisputeDetailsDTO.BookingSummary.builder()
                .id(booking.getId())
                .status(booking.getStatus() != null ? booking.getStatus().name() : null)
                .serviceDescription(booking.getServiceDescription())
                .serviceAddress(booking.getServiceAddress())
                .price(booking.getPrice())
                .userName(user != null ? user.getName() : booking.getUserName())
                .userPhone(user != null ? user.getPhone() : null)
                .tradespersonName(tradesperson != null ? tradesperson.getName() : null)
                .tradespersonPhone(tradesperson != null ? tradesperson.getPhone() : null)
                .build();
    }
}
