package tavindev.core.entities;


import java.util.UUID;

public class Corporation {

    private String id;
    private String name;
    private String description;
    private String address;
    private String nif;
    private String email;
    private String phone;
    private String publicURL;

    public Corporation(String id,
                       String name,
                      String description,
                      String address,
                      String nif,
                      String email,
                      String phone,
                      String publicURL) {
        this.id = UUID.randomUUID().toString();;
        this.name = name;
        this.description = description;
        this.address = address;
        this.nif = nif;
        this.email = email;
        this.phone = phone;
        this.publicURL = publicURL;
    }

    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getDescription() {return description;}
    public String getAddress() {return address;}
    public String getNif() {return nif;}
    public String getEmail() {return email;}
    public String getPhone() {return phone;}
    public String getPublicURL() {return publicURL;}
}
