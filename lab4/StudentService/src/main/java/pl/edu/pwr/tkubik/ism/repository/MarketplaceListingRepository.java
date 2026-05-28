package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.MarketplaceListingEntity;

import java.util.List;
import java.util.UUID;

public interface MarketplaceListingRepository extends JpaRepository<MarketplaceListingEntity, UUID> {
    List<MarketplaceListingEntity> findBySellerId(UUID sellerId);
    List<MarketplaceListingEntity> findByStatus(String status);
}
