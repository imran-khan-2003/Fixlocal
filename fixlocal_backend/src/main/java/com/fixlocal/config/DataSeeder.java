package com.fixlocal.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fixlocal.model.Testimonial;
import com.fixlocal.repository.TestimonialRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedTestimonials(TestimonialRepository testimonialRepository) {
        return args -> {
            if (testimonialRepository.count() == 0) {
                List<Testimonial> seeds = List.of(
                        Testimonial.create("Maya", "Bengaluru", "Homeowner", "FixLocal helped me compare verified electricians in minutes and release payment only after I signed off."),
                        Testimonial.create("Rohit", "Pune", "Homeowner", "Loved the live map and secure chat. The support team mediated my snag until it was fixed."),
                        Testimonial.create("Sarah", "Mumbai", "Tradesperson", "My FixLocal profile shows badges and keeps quality leads flowing every week."),
                        Testimonial.create("Imran", "Hyderabad", "Tradesperson", "Instant payments after completion and zero haggling. FixLocal keeps my crew busy."),
                        Testimonial.create("Aisha", "Chennai", "Homeowner", "Booked deep cleaning in 5 minutes. The concierge even helped shortlist the best team."),
                        Testimonial.create("Kabir", "Delhi", "Homeowner", "Escrow plus dispute tracking gave me confidence to book a major renovation."),
                        Testimonial.create("Leela", "Kochi", "Homeowner", "FixLocal’s verified plumbers handled my rental property with zero supervision."),
                        Testimonial.create("Zara", "Jaipur", "Tradesperson", "Digital invoices and escrow releases make my interior design studio professional.")
                );
                testimonialRepository.saveAll(seeds);
            }
        };
    }
}