# Endpoint: Importação de Folha de Obra (`IMP-FO`)

## Descrição
Permite ao usuário com o papel `SMBO` importar uma folha de obra no formato **GeoJSON**, conforme o esquema esperado pelo sistema.

## Método HTTP
`POST`

## Endpoint
`/api/folhas-obra/importar`

## Permissões
- Role obrigatória: `SMBO` (Sheet Manager)

## Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

## Corpo da Requisição (JSON)
```json
{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:EPSG::3763"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "aigp": "Ortiga",
        "rural_property_id": "141307_S_45",
        "polygon_id": 18,
        "UI_id": 46
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[10228.94, -20885.37], [10225.71, -20879.74], ...]]
      }
    }
    // Mais features...
  ],

  "metadata": {
    "id": 2,
    "starting_date": "2025-06-02",
    "finishing_date": "2025-06-15",
    "issue_date": "2025-05-10",
    "service_provider_id": 3,
    "award_date": "2025-05-12",
    "issuing_user_id": 2,
    "aigp": ["Ortiga", "Envendos"],
    "posa_code": "6.1.1.1",
    "posa_description": "Matos",
    "posp_code": "3.1.1.1",
    "posp_description": "Pastagens Melhoradas",
    "operations": [
      {
        "operation_code": "Or13",
        "operation_description": "Controlo da vegetação espontânea",
        "area_ha": 5.12
      },
      {
        "operation_code": "N2a",
        "operation_description": "Melhoria de pastagens permanentes",
        "area_ha": 5.12
      }
    ]
  }
}
```

## Respostas

### ✅ Sucesso – `201 Created`
```json
{
  "message": "Folha de obra importada com sucesso",
  "folha_id": 2
}
```

### ❌ Erros

#### `400 Bad Request`
- Estrutura do GeoJSON inválida
- Campos obrigatórios ausentes

#### `401 Unauthorized`
- Token inválido ou ausente

#### `403 Forbidden`
- Role do usuário não é `SMBO`

#### `409 Conflict`
- Folha com mesmo `metadata.id` já existente
