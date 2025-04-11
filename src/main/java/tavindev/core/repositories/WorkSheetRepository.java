package tavindev.core.repositories;

import tavindev.core.entities.WorkSheet;
import java.util.Optional;

public interface WorkSheetRepository {
    WorkSheet save(WorkSheet workSheet);
}