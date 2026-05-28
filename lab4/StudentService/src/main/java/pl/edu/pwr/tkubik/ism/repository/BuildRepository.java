package pl.edu.pwr.tkubik.ism.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.pwr.tkubik.ism.entity.BuildEntity;

import java.util.UUID;

public interface BuildRepository extends JpaRepository<BuildEntity, UUID> {
}