package tavindev.infra.repositories;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;

public class DatastoreManager {
    private static final Datastore instance = DatastoreOptions.getDefaultInstance().getService();

    public static Datastore getInstance() {
        return instance;
    }
} 