package tavindev.core.entities;

import java.util.UUID;
import java.util.List;
import tavindev.core.exceptions.BadRequestException;

public class WorkSheet {
    private final String referenciaObra;
    private final String descricao;
    private final TargetType tipoAlvo;
    private final AwardStatus estadoAdjudicacao;
    private final String dataAdjudicacao;
    private final String dataInicioPrevista;
    private final String dataConclusaoPrevista;
    private final String contaEntidade;
    private final String entidadeAdjudicacao;
    private final String nifEmpresa;
    private final WorkStatus estadoObra;
    private final String observacoes;
    
    // New fields for IMP-FO operation
    private final Integer id;
    private final String startingDate;
    private final String finishingDate;
    private final String issueDate;
    private final Integer serviceProviderId;
    private final String awardDate;
    private final Integer issuingUserId;
    private final List<String> aigp;
    private final String posaCode;
    private final String posaDescription;
    private final String pospCode;
    private final String pospDescription;
    private final List<Operation> operations;
    private final List<Feature> features;

    // Original constructor for backward compatibility
    public WorkSheet(String referenciaObra, String descricao, TargetType tipoAlvo,
                    AwardStatus estadoAdjudicacao, String dataAdjudicacao,
                    String dataInicioPrevista, String dataConclusaoPrevista,
                    String contaEntidade, String entidadeAdjudicacao, String nifEmpresa,
                    WorkStatus estadoObra, String observacoes) {
        this(referenciaObra, descricao, tipoAlvo, estadoAdjudicacao, dataAdjudicacao,
             dataInicioPrevista, dataConclusaoPrevista, contaEntidade, entidadeAdjudicacao,
             nifEmpresa, estadoObra, observacoes, null, null, null, null, null, null,
             null, null, null, null, null, null, null, null);
    }

    // Extended constructor for IMP-FO operation
    public WorkSheet(String referenciaObra, String descricao, TargetType tipoAlvo,
                    AwardStatus estadoAdjudicacao, String dataAdjudicacao,
                    String dataInicioPrevista, String dataConclusaoPrevista,
                    String contaEntidade, String entidadeAdjudicacao, String nifEmpresa,
                    WorkStatus estadoObra, String observacoes,
                    Integer id, String startingDate, String finishingDate, String issueDate,
                    Integer serviceProviderId, String awardDate, Integer issuingUserId,
                    List<String> aigp, String posaCode, String posaDescription,
                    String pospCode, String pospDescription, List<Operation> operations,
                    List<Feature> features) {
        this.referenciaObra = referenciaObra;
        this.descricao = descricao;
        this.tipoAlvo = tipoAlvo;
        this.estadoAdjudicacao = estadoAdjudicacao;
        
        // IMP-FO specific fields
        this.id = id;
        this.startingDate = startingDate;
        this.finishingDate = finishingDate;
        this.issueDate = issueDate;
        this.serviceProviderId = serviceProviderId;
        this.awardDate = awardDate;
        this.issuingUserId = issuingUserId;
        this.aigp = aigp;
        this.posaCode = posaCode;
        this.posaDescription = posaDescription;
        this.pospCode = pospCode;
        this.pospDescription = pospDescription;
        this.operations = operations;
        this.features = features;
        
        if (estadoAdjudicacao == AwardStatus.ADJUDICADO) {
            // Validate all adjudication-related fields are provided
            if (dataAdjudicacao == null) {
                throw new BadRequestException("Data de adjudicação é obrigatória quando a obra está adjudicada");
            }
            if (dataInicioPrevista == null) {
                throw new BadRequestException("Data prevista de início é obrigatória quando a obra está adjudicada");
            }
            if (dataConclusaoPrevista == null) {
                throw new BadRequestException("Data prevista de conclusão é obrigatória quando a obra está adjudicada");
            }
            if (contaEntidade == null) {
                throw new BadRequestException("Conta de entidade é obrigatória quando a obra está adjudicada");
            }
            if (entidadeAdjudicacao == null) {
                throw new BadRequestException("Entidade de adjudicação é obrigatória quando a obra está adjudicada");
            }
            if (nifEmpresa == null) {
                throw new BadRequestException("NIF da empresa é obrigatório quando a obra está adjudicada");
            }
            if (estadoObra == null) {
                throw new BadRequestException("Estado da obra é obrigatório quando a obra está adjudicada");
            }

            this.dataAdjudicacao = dataAdjudicacao;
            this.dataInicioPrevista = dataInicioPrevista;
            this.dataConclusaoPrevista = dataConclusaoPrevista;
            this.contaEntidade = contaEntidade;
            this.entidadeAdjudicacao = entidadeAdjudicacao;
            this.nifEmpresa = nifEmpresa;
            this.estadoObra = estadoObra;
            this.observacoes = observacoes; // observações são opcionais
        } else {
            // Clear all adjudication-related fields if not adjudicated
            this.dataAdjudicacao = null;
            this.dataInicioPrevista = null;
            this.dataConclusaoPrevista = null;
            this.contaEntidade = null;
            this.entidadeAdjudicacao = null;
            this.nifEmpresa = null;
            this.estadoObra = null;
            this.observacoes = null;
        }
    }

    public String getReferenciaObra() {
        return referenciaObra;
    }

    public String getDescricao() {
        return descricao;
    }

    public TargetType getTipoAlvo() {
        return tipoAlvo;
    }

    public AwardStatus getEstadoAdjudicacao() {
        return estadoAdjudicacao;
    }

    public String getDataAdjudicacao() {
        return dataAdjudicacao;
    }

    public String getDataInicioPrevista() {
        return dataInicioPrevista;
    }

    public String getDataConclusaoPrevista() {
        return dataConclusaoPrevista;
    }

    public String getContaEntidade() {
        return contaEntidade;
    }

    public String getEntidadeAdjudicacao() {
        return entidadeAdjudicacao;
    }

    public String getNifEmpresa() {
        return nifEmpresa;
    }

    public WorkStatus getEstadoObra() {
        return estadoObra;
    }

    public String getObservacoes() {
        return observacoes;
    }

    // Getters for new fields
    public Integer getId() {
        return id;
    }

    public String getStartingDate() {
        return startingDate;
    }

    public String getFinishingDate() {
        return finishingDate;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public Integer getServiceProviderId() {
        return serviceProviderId;
    }

    public String getAwardDate() {
        return awardDate;
    }

    public Integer getIssuingUserId() {
        return issuingUserId;
    }

    public List<String> getAigp() {
        return aigp;
    }

    public String getPosaCode() {
        return posaCode;
    }

    public String getPosaDescription() {
        return posaDescription;
    }

    public String getPospCode() {
        return pospCode;
    }

    public String getPospDescription() {
        return pospDescription;
    }

    public List<Operation> getOperations() {
        return operations;
    }

    public List<Feature> getFeatures() {
        return features;
    }

    // Supporting classes for GeoJSON structure
    public static class Operation {
        private final String operationCode;
        private final String operationDescription;
        private final Double areaHa;

        public Operation(String operationCode, String operationDescription, Double areaHa) {
            this.operationCode = operationCode;
            this.operationDescription = operationDescription;
            this.areaHa = areaHa;
        }

        public String getOperationCode() {
            return operationCode;
        }

        public String getOperationDescription() {
            return operationDescription;
        }

        public Double getAreaHa() {
            return areaHa;
        }
    }

    public static class Feature {
        private final String type;
        private final FeatureProperties properties;
        private final Geometry geometry;

        public Feature(String type, FeatureProperties properties, Geometry geometry) {
            this.type = type;
            this.properties = properties;
            this.geometry = geometry;
        }

        public String getType() {
            return type;
        }

        public FeatureProperties getProperties() {
            return properties;
        }

        public Geometry getGeometry() {
            return geometry;
        }
    }

    public static class FeatureProperties {
        private final String aigp;
        private final String ruralPropertyId;
        private final Integer polygonId;
        private final Integer uiId;

        public FeatureProperties(String aigp, String ruralPropertyId, Integer polygonId, Integer uiId) {
            this.aigp = aigp;
            this.ruralPropertyId = ruralPropertyId;
            this.polygonId = polygonId;
            this.uiId = uiId;
        }

        public String getAigp() {
            return aigp;
        }

        public String getRuralPropertyId() {
            return ruralPropertyId;
        }

        public Integer getPolygonId() {
            return polygonId;
        }

        public Integer getUiId() {
            return uiId;
        }
    }

    public static class Geometry {
        private final String type;
        private final Object coordinates; // Can be List<List<List<Double>>> for Polygon

        public Geometry(String type, Object coordinates) {
            this.type = type;
            this.coordinates = coordinates;
        }

        public String getType() {
            return type;
        }

        public Object getCoordinates() {
            return coordinates;
        }
    }

    public enum TargetType {
        PROPRIEDADE_PUBLICA,
        PROPRIEDADE_PRIVADA
    }

    public enum AwardStatus {
        ADJUDICADO,
        NAO_ADJUDICADO
    }

    public enum WorkStatus {
        NAO_INICIADO,
        EM_CURSO,
        CONCLUIDO
    }
} 