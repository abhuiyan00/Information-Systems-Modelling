package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "marketplace_listings")
public class MarketplaceListingEntity {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "seller_id")
    private UserEntity seller;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "build_id")
    private BuildEntity build;

    @Column                              private String title;
    @Column(name = "part_category")      private String partCategory;
    @Column                              private String brand;
    @Column                              private String condition_;
    @Column(name = "price_pln")          private Double pricePln;
    @Column                              private String currency;
    @Column                              private String status;
    @Column(length = 2000)               private String description;
    @Column(name = "created_at")         private OffsetDateTime createdAt;

    public MarketplaceListingEntity() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UserEntity getSeller() { return seller; }
    public void setSeller(UserEntity v) { this.seller = v; }
    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity v) { this.build = v; }
    public String getTitle() { return title; }
    public void setTitle(String v) { this.title = v; }
    public String getPartCategory() { return partCategory; }
    public void setPartCategory(String v) { this.partCategory = v; }
    public String getBrand() { return brand; }
    public void setBrand(String v) { this.brand = v; }
    public String getCondition() { return condition_; }
    public void setCondition(String v) { this.condition_ = v; }
    public Double getPricePln() { return pricePln; }
    public void setPricePln(Double v) { this.pricePln = v; }
    public String getCurrency() { return currency; }
    public void setCurrency(String v) { this.currency = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime v) { this.createdAt = v; }
}
