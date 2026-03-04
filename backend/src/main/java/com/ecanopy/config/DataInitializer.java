package com.ecanopy.config;

import com.ecanopy.entity.*;
import com.ecanopy.entity.enums.HelpType;
import com.ecanopy.entity.enums.ResidentType;
import com.ecanopy.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * DataInitializer
 * Seeds the database with realistic society data for testing/demo
 */
@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

        private final RoleRepository roleRepository;
        private final UserRepository userRepository;
        private final SocietyRepository societyRepository;
        private final BuildingRepository buildingRepository;
        private final FlatRepository flatRepository;
        private final ResidentRepository residentRepository;
        private final DomesticHelpRepository domesticHelpRepository;
        private final PollRepository pollRepository;
        private final PasswordEncoder passwordEncoder;
        private final NoticeRepository noticeRepository;

        private final AmenityRepository amenityRepository;

        public DataInitializer(RoleRepository roleRepository, UserRepository userRepository,
                        SocietyRepository societyRepository, BuildingRepository buildingRepository,
                        FlatRepository flatRepository, ResidentRepository residentRepository,
                        DomesticHelpRepository domesticHelpRepository, PollRepository pollRepository,
                        PasswordEncoder passwordEncoder, NoticeRepository noticeRepository,
                        AmenityRepository amenityRepository) {
                this.roleRepository = roleRepository;
                this.userRepository = userRepository;
                this.societyRepository = societyRepository;
                this.buildingRepository = buildingRepository;
                this.flatRepository = flatRepository;
                this.residentRepository = residentRepository;
                this.domesticHelpRepository = domesticHelpRepository;
                this.pollRepository = pollRepository;
                this.passwordEncoder = passwordEncoder;
                this.noticeRepository = noticeRepository;
                this.amenityRepository = amenityRepository;
        }

        @Override
        @Transactional
        public void run(String... args) {
                log.info("Starting Data Seeding...");
                seedRoles();
                seedSuperAdmin();

                Society society;
                if (societyRepository.count() > 0) {
                        log.info("Society data already seeded.");
                        society = societyRepository.findAll().get(0);
                } else {
                        society = seedSociety();
                        Building towerA = seedBuildingsAndFlats(society);
                        seedUsersAndResidents(society, towerA);
                        seedDomesticHelp(towerA);
                        seedNotices(society);
                        seedPolls(society);
                }

                // Seed amenities for ALL societies to ensure all demo users see data
                societyRepository.findAll().forEach(this::seedAmenities);

                log.info("Data Seeding Completed Successfully.");
        }

        private void seedRoles() {
                String[] roles = {
                                "ROLE_ADMIN", "ROLE_SUPER_ADMIN", "ROLE_RESIDENT",
                                "ROLE_SECURITY_GUARD", "ROLE_RWA_PRESIDENT",
                                "ROLE_RWA_SECRETARY", "ROLE_STAFF"
                };

                for (String roleName : roles) {
                        if (roleRepository.findByName(roleName).isEmpty()) {
                                roleRepository.save(new Role(roleName));
                        }
                }
        }

        private void seedSuperAdmin() {
                if (userRepository.findByEmail("superadmin@ecanopy.com").isPresent()) {
                        return;
                }

                Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN")
                                .orElseThrow(() -> new RuntimeException("ROLE_SUPER_ADMIN not found"));

                User superAdmin = User.builder()
                                .fullName("System Super Admin")
                                .email("superadmin@ecanopy.com")
                                .password(passwordEncoder.encode("SuperAdmin@123"))
                                .phoneNumber("9999999999")
                                .roles(new HashSet<>(Set.of(superAdminRole)))
                                .enabled(true)
                                .build();

                userRepository.save(superAdmin);
                log.info("Super Admin user seeded.");
        }

        private Society seedSociety() {
                return societyRepository.save(Society.builder()
                                .societyName("Greenwood Residency")
                                .address("Sector 45, Gurgaon, Haryana")
                                .societyDescription("Premium Gated Community with 500+ Flats")
                                .isActive(true)
                                .build());
        }

        private Building seedBuildingsAndFlats(Society society) {
                Building towerA = Building.builder()
                                .buildingName("Tower A")
                                .totalFloors(10)
                                .society(society)
                                .build();

                // Creating Flats for Tower A
                Set<Flat> flats = new HashSet<>();
                for (int i = 1; i <= 4; i++) {
                        flats.add(Flat.builder()
                                        .flatNumber("A-10" + i)
                                        .floor(1)
                                        .bedrooms(3)
                                        .building(towerA)
                                        .maxResident(5)
                                        .build());
                }
                towerA.setFlats(flats);
                return buildingRepository.save(towerA);
        }

        private void seedUsersAndResidents(Society society, Building towerA) {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
                Role residentRole = roleRepository.findByName("ROLE_RESIDENT").orElseThrow();
                Role guardRole = roleRepository.findByName("ROLE_SECURITY_GUARD").orElseThrow();

                // Admin User
                User admin = User.builder()
                                .fullName("Society Admin")
                                .email("admin@greenwood.com")
                                .password(passwordEncoder.encode("Admin@123"))
                                .phoneNumber("9876543210")
                                .roles(new HashSet<>(Set.of(adminRole)))
                                .enabled(true)
                                .societyId(society.getSocietyId())
                                .build();
                if (userRepository.findByEmail("admin@greenwood.com").isEmpty()) {
                        userRepository.save(admin);
                }

                // Security Guard
                User guard = User.builder()
                                .fullName("Ram Singh (Guard)")
                                .email("guard@greenwood.com")
                                .password(passwordEncoder.encode("Guard@123"))
                                .phoneNumber("9876543211")
                                .roles(new HashSet<>(Set.of(guardRole)))
                                .enabled(true)
                                .societyId(society.getSocietyId())
                                .build();
                if (userRepository.findByEmail("guard@greenwood.com").isEmpty()) {
                        userRepository.save(guard);
                }

                // Resident 1 (Owner)
                Flat flat101 = towerA.getFlats().stream().filter(f -> f.getFlatNumber().equals("A-101")).findFirst()
                                .orElseThrow();
                User residentUser1 = User.builder()
                                .fullName("Rahul Sharma")
                                .email("rahul@gmail.com")
                                .password(passwordEncoder.encode("Rahul@123"))
                                .phoneNumber("9000000001")
                                .roles(new HashSet<>(Set.of(residentRole)))
                                .enabled(true)
                                .flatId(flat101.getFlatId())
                                .build();
                userRepository.save(residentUser1);

                Resident resident1 = Resident.builder()
                                .fullName("Rahul Sharma")
                                .email("rahul@gmail.com")
                                .phone("9000000001")
                                .residentType(ResidentType.OWNER)
                                .user(residentUser1)
                                .flat(flat101)
                                .build();
                residentRepository.save(resident1);

                flat101.setIsOccupied(true);
                flatRepository.save(flat101); // Update flat status

                // Resident 2 (Tenant)
                Flat flat102 = towerA.getFlats().stream().filter(f -> f.getFlatNumber().equals("A-102")).findFirst()
                                .orElseThrow();
                User residentUser2 = User.builder()
                                .fullName("Priya Verma")
                                .email("priya@gmail.com")
                                .password(passwordEncoder.encode("Priya@123"))
                                .phoneNumber("9000000002")
                                .roles(new HashSet<>(Set.of(residentRole)))
                                .enabled(true)
                                .flatId(flat102.getFlatId())
                                .build();
                userRepository.save(residentUser2);

                Resident resident2 = Resident.builder()
                                .fullName("Priya Verma")
                                .email("priya@gmail.com")
                                .phone("9000000002")
                                .residentType(ResidentType.TENANT)
                                .user(residentUser2)
                                .flat(flat102)
                                .build();
                residentRepository.save(resident2);

                flat102.setIsOccupied(true);
                flatRepository.save(flat102);

                // Resident 3 (Sara - Resident)
                Flat flat103 = towerA.getFlats().stream().filter(f -> f.getFlatNumber().equals("A-103")).findFirst()
                                .orElseThrow();
                if (userRepository.findByEmail("sara@ecanopy.com").isEmpty()) {
                        User residentUser3 = User.builder()
                                        .fullName("Sara")
                                        .email("sara@ecanopy.com")
                                        .password(passwordEncoder.encode("Sara@123"))
                                        .phoneNumber("9000000003")
                                        .roles(new HashSet<>(Set.of(residentRole)))
                                        .enabled(true)
                                        .flatId(flat103.getFlatId())
                                        .build();
                        userRepository.save(residentUser3);

                        Resident resident3 = Resident.builder()
                                        .fullName("Sara")
                                        .email("sara@ecanopy.com")
                                        .phone("9000000003")
                                        .residentType(ResidentType.OWNER)
                                        .user(residentUser3)
                                        .flat(flat103)
                                        .build();
                        residentRepository.save(resident3);

                        flat103.setIsOccupied(true);
                        flatRepository.save(flat103);
                }
        }

        private void seedDomesticHelp(Building towerA) {
                Flat flat101 = towerA.getFlats().stream().filter(f -> f.getFlatNumber().equals("A-101")).findFirst()
                                .orElseThrow();

                DomesticHelp maid = DomesticHelp.builder()
                                .name("Sunita Devi")
                                .phone("8888888888")
                                .helpType(HelpType.MAID)
                                .passCode("123456")
                                .flats(new HashSet<>(Set.of(flat101)))
                                .society(towerA.getSociety())
                                .build();
                domesticHelpRepository.save(maid);
        }

        private void seedNotices(Society society) {
                noticeRepository.save(Notice.builder()
                                .title("AGM Meeting on Sunday")
                                .content("Annual General Meeting will be held on 25th Jan at 10 AM in Clubhouse.")
                                .society(society)
                                .isActive(true)
                                .build());
        }

        private void seedPolls(Society society) {
                User admin = userRepository.findByEmail("admin@greenwood.com").orElseThrow();

                pollRepository.save(Poll.builder()
                                .question("Should we install Solar Panels?")
                                .option1("Yes")
                                .option2("No")
                                .expiryDate(LocalDateTime.now().plusDays(7))
                                .society(society)
                                .createdBy(admin)
                                .build());
        }

        private void seedAmenities(Society society) {
                if (amenityRepository.findBySocietySocietyId(society.getSocietyId()).isEmpty()) {
                        log.info("Seeding amenities...");

                        Amenity swimmingPool = Amenity.builder()
                                        .amenityName("Swimming Pool")
                                        .description("Olympic size swimming pool with temperature control.")
                                        .capacity(50)
                                        .rules("Wear proper swimwear. Shower before entering.")
                                        .isActive(true)
                                        .society(society)
                                        .build();

                        Amenity gym = Amenity.builder()
                                        .amenityName("Gymnasium")
                                        .description("Fully equipped gym with cardio and weight sections.")
                                        .capacity(30)
                                        .rules("Carry your own towel. Wipe equipment after use.")
                                        .isActive(true)
                                        .society(society)
                                        .build();

                        Amenity clubHouse = Amenity.builder()
                                        .amenityName("Clubhouse Hall")
                                        .description("Spacious hall for parties and events.")
                                        .capacity(100)
                                        .rules("No loud music after 10 PM.")
                                        .isActive(true)
                                        .society(society)
                                        .build();

                        Amenity tennisCourt = Amenity.builder()
                                        .amenityName("Tennis Court")
                                        .description("Synthetic hard court.")
                                        .capacity(4)
                                        .rules("Non-marking shoes mandatory.")
                                        .isActive(true)
                                        .society(society)
                                        .build();

                        amenityRepository.saveAll(Arrays.asList(swimmingPool, gym, clubHouse, tennisCourt));
                        log.info("Amenities seeded.");
                }
        }
}
