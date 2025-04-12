package tavindev.core.repositories;

import tavindev.core.entities.WorkSheet;
import java.util.Optional;

public interface WorkSheetRepository {
    boolean exists(String id);
    WorkSheet save(WorkSheet workSheet);
}