package pl.edu.pwr.tkubik.ism.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "media_files")
public class MediaFileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "url")
    private String url;

    @Column(name = "filename")
    private String filename;

    @Column(name = "size_bytes")
    private Integer sizeBytes;

    @Column(name = "mime_type")
    private String mimeType;

    @ManyToOne
    @JoinColumn(name = "build_id")
    private BuildEntity build;

    // constructors
    public MediaFileEntity() {
    }

    // getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public Integer getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Integer sizeBytes) { this.sizeBytes = sizeBytes; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public BuildEntity getBuild() { return build; }
    public void setBuild(BuildEntity build) { this.build = build; }
}