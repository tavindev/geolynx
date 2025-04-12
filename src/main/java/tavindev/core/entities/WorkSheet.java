package tavindev.core.entities;

import java.util.UUID;
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

    public WorkSheet(String referenciaObra, String descricao, TargetType tipoAlvo,
                    AwardStatus estadoAdjudicacao, String dataAdjudicacao,
                    String dataInicioPrevista, String dataConclusaoPrevista,
                    String contaEntidade, String entidadeAdjudicacao, String nifEmpresa,
                    WorkStatus estadoObra, String observacoes) {
        this.referenciaObra = referenciaObra;
        this.descricao = descricao;
        this.tipoAlvo = tipoAlvo;
        this.estadoAdjudicacao = estadoAdjudicacao;
        
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