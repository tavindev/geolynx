package tavindev;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import tavindev.core.entities.Corporation;
import tavindev.infra.repositories.DatastoreCorporationRepository;

@WebListener
public class CreateCorporations implements ServletContextListener {
    private final DatastoreCorporationRepository corporationRepository;

    public CreateCorporations() {
        this.corporationRepository = new DatastoreCorporationRepository();
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Create Estrela do Norte Lda.
        createCorporationIfNotExists("506383125", "Estrela do Norte Lda.",
                "Obras de Engenharia, construção civil",
                "Tocadelos, 2670-770 Lousa, LRS",
                "geral@estreladonorte.pt",
                "(+351) 492 97 60",
                "https://www.estreladonorte.pt/");

        // Create FavorityAudaz
        createCorporationIfNotExists("510985564", "FavorityAudaz",
                "Reflorestação e Plantação de Árvores, Corte e Abate e Limpeza de Terrenos",
                "Urbanização Terra Negra Rua 3 nº76 Rch Drt 4520-620 São João de Ver",
                "geral@favoritiaudaz.pt",
                "(+351) 919 667 589",
                "https://favoritiaudaz.pt/");

        // Create ValMáquinas
        createCorporationIfNotExists("516108204", "ValMáquinas",
                "Terraplanagem, Limpeza de terrenos, preparação e limpeza de terrenos agrícolas, terraplanagem e locais para a Construção",
                "Rua António Lourenço nº 9, Faralhão - 2910-149 Setúbal Portugal",
                "geral@valmaquinas.pt",
                "+ (351) 265 405 839",
                "https://valmaquinas.pt/");

        // Create Transcava
        createCorporationIfNotExists("515910082", "Transcava",
                "Terraplanagem, Movimentação de Terras e Limpeza de Terrenos",
                "Rua Pedro Nunes, Lt 23 e 24, Zona Industrial, 2500-303 Caldas da Rainha",
                "geral@transcava.pt",
                "(+351) 911982206",
                "https://www.transcava.pt/");

        // Create Ricardo Rocha - Limpeza de Terrenos
        createCorporationIfNotExists("516852140", "Ricardo Rocha - Limpeza de Terrenos",
                "Limpeza de Terrenos e Serviços Florestais",
                "Rua Quita Nova, 211, 2400-432 Leiria",
                "ricardo.rocha.servicos@gmail.com",
                "(+351)965768405",
                "https://www.facebook.com/p/Ricardo-Rocha-Limpeza-de-Terrenos-Ma%C3%A7%C3%A3o-61559868281095/");

        // Create Pedrosa e Irmãos, Lda.
        createCorporationIfNotExists("500579415", "Pedrosa e Irmãos, Lda.",
                "Planeamento Florestal, Gestão Florestal, Limpeza de Florestas, Abate e Reflorestação e Preparação de Terrenos",
                "Rua Dr. Luis Pereira da Costa N. 78 2425-617 Monte Redondo Leiria Portugal",
                "geral@pedrosairmaos.com",
                "+351 244 685 167",
                "https://www.pedrosairmaos.com/");

        // Create Silvokoala
        createCorporationIfNotExists("505472562", "Silvokoala",
                "Serviços florestais, eficiência dos processos operacionais e qualificação dos recursos humanos, Utilização de equipamentos de proteção individual",
                "Rua da Travessa da Filarmónica nº 43, 4140-276, Montemor-o-Velho",
                "geral@silvokoala.pt",
                "(+351) 239 098 478",
                "https://silvokoala.com/");

        // Create Silvapor - Ambiente & Inovação, Lda
        createCorporationIfNotExists("500738220", "Silvapor - Ambiente & Inovação, Lda",
                "Silvicultura, Ambiente e Inovação, Construção Agricultura, Transforação de Espaços Verdes e Paisagens Rurais, Paisagismo, Conservação Rural e Ambiental e produtos Relacionados",
                "Quinta da Devesa - Sra da Graça 6060-191 Idanha-a-Nova",
                "silvapor@silvapor.pt",
                "(+351) 277 208 208",
                "https://silvapor.pt/");

        // Create Agrocenteno
        createCorporationIfNotExists("515046094", "Agrocenteno",
                "Silvicultura e Manutenção Florestal – Preparação Manutenção de Espaços Verdes e Floresta – Aplicação de Produtos Fitofarmacêuticos – Mobilização de Solos – Limpeza de Bermas de Estrada – Desmataçoes – Podas",
                "Casais da Amendoeira Cartaxo 2070-361 Santarém",
                "geral@agrocenteno.pt",
                "+351 243 790 406",
                "https://agrocenteno.pt/");

        // Create Verde Nobre
        createCorporationIfNotExists("508714893", "Verde Nobre",
                "Especialistas em restauração ambiental, isolamento de áreas, revestimento de solo, produção e plantio de mudas, e elaboração de relatórios técnicos.",
                "Rua das Orquídeas, 737, Sala 714, Bairro Jardim Pompeia, Indaiatuba/SP CEP 13345-040, Condomínio Office Premium, Torre Business",
                "contato@verdenobre.com",
                "(+351) 197186466",
                "https://www.verdenobre.com/");

        // Create Abramud e Sentido Verde Lda
        createCorporationIfNotExists("510012388", "Abramud e Sentido Verde Lda",
                "Reflorestação, Venda de Plantas Florestais, Projetos de Arborização e outras Atividades Florestais",
                "Estrada Nacional 3, Km 105.9 Rio de Moinhos, 2200-782 Abrantes",
                "geral@sentidoverde.pt",
                "(+351) 939 851521",
                "https://sentidoverde.pt/");

        // Create Planfor
        createCorporationIfNotExists("502384434", "Planfor",
                "Florestação, Reflorestação de Matas, Viveiro de Plantas e Jardinagem, Lavoura Florestal",
                "Pepiniéres PLANFOR, 1950 Route de Cère, 40090 UCHACQ - France",
                "planfor@planfor.fr",
                "(+33) 214245101",
                "https://www.planfor.pt/");

        // Create Arborista
        createCorporationIfNotExists("517947579", "Arborista",
                "Poda Seletiva de árvores, Limpeza de Copas. Desmantelamento de Árvores, Consultoria Ambiental",
                "Rua Parque do Cabedal, Condomínio do Cabedal, Sesimbra",
                "arborista@arborista.pt",
                "(+351)9105033178",
                "https://arborista.pt/");

        // Create Matigreen
        createCorporationIfNotExists("515041629", "Matigreen",
                "Desmatação, Limpeza de Florestas, Proteção contra Incêndios, Abertura de Aceiros e Caminhos, Limpeza de Caminhos, Responsabilidade Social e Ambiental, Sustentabilidade Ambiental Parques Fotovoltaicos",
                "Rua do Cruzeiro 12, Pinheiro 2490-617 Ourém",
                "geral@matigreen.pt",
                "+351 911 966 489",
                "https://matigreen.pt/");

        // Create EcoForest
        createCorporationIfNotExists("A36871804", "EcoForest",
                "Desmatação, Limpeza de terrenos agrícolas e florestais",
                "Rua Cruz de Pedra, 199, Braga, Portugal",
                "geral@eco-forest.pt",
                "(+351) 966 619 660",
                "https://www.eco-forest.pt/");

        // Create AJManata Jardins
        createCorporationIfNotExists("501910720", "AJManata Jardins",
                "Limpezas Florestais e Desmatações, Podas de árvores e Arbustos, Jardinagem",
                "Avenida Bombeiros Voluntários 46 2705-180 Colares, Sintra, Portugal",
                "geral@ajmanatajardins.pt",
                "(+351) 210 446 550",
                "https://www.ajmanatajardins.com/");

        // Create Giestas
        createCorporationIfNotExists("513215212", "Giestas",
                "Serviços de Limpeza Florestal, Desmatação e Operações Mecanizadas",
                "Rua do Monte da Penide, 390, 4755-049 Areias de Vilar, Barcelos",
                "geral@giestas.pt",
                "(+351) 967 878 353",
                "https://giestas.pt/");

        // Create Videmiatrix
        createCorporationIfNotExists("508494044", "Videmiatrix",
                "Limpeza de Terrenos Agrícolas e Florestais",
                "Avenida do Telhal 16, 4400-598 Vila Nova de Gaia, Portugal",
                "geral@limpezaterreno.pt",
                "(+351) 963 011 550",
                "https://limpezaterreno.pt/");

        // Create Abrangreen – Instalações Técnicas Unipessoal Lda
        createCorporationIfNotExists("513647490", "Abrangreen – Instalações Técnicas Unipessoal Lda",
                "Sistemas de Rega, Agricultura, Replantações",
                "Largo do Comércio 21, 2200-031 Abrantes",
                "geral@abrangreen.pt",
                "(+351) 241 404 635",
                "https://copadinamica.pt/");

        // Create Terras de Viriato
        createCorporationIfNotExists("507224930", "Terras de Viriato",
                "Limpeza e Desmatagem, Remodelação Territorial, Prevenção de Incêndios Florestais, Limpeza de Terrenos, Manutenção de Áreas Agrícolas e Florestais, Sistema e Rega",
                "Vivenda Santos, Lagoa do Cão, 2460-613 Aljubarrota-Prazeres, Alcobaça, Portugal",
                "mail@terrasdeviriato.pt",
                "(+351) 934 672 113",
                "https://www.terrasdeviriato.com/");
    }

    private void createCorporationIfNotExists(String nif, String name, String description,
            String address, String email, String phone, String publicURL) {
        if (corporationRepository.findByNif(nif) == null) {
            Corporation corporation = new Corporation(
                    null, // ID will be generated in constructor
                    name,
                    description,
                    address,
                    nif,
                    email,
                    phone,
                    publicURL);
            corporationRepository.save(corporation);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Cleanup code
    }
}
