# E2E 주문 프로세스 가이드

## 개요

이 문서는 B2C 주문 Portal에서 고객이 주문을 생성한 후, SAP S/4HANA에서 Order-to-Cash(OTC) 프로세스가 완료되기까지의 전체 E2E 흐름을 설명합니다.

```
┌─────────────┐     OData API      ┌──────────────────┐
│  Web Portal │ ──────────────────► │  SAP S/4HANA     │
│  (Next.js)  │  Sales Order 생성   │  (FPS02 / 1809)  │
└─────────────┘                    └──────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
              Sales Order           Delivery              Billing
              (VA01/VA03)         (VL01N/VL02N)          (VF01/VF02)
                    │                     │                     │
                    │                     ▼                     ▼
                    │              Goods Issue            Accounting
                    │              (VL02N - PGI)         (자동 전기)
                    │                     │                     │
                    └─────────────────────┴─────────────────────┘
                                   Order-to-Cash 완료
```

---

## 1단계: Web Portal — 주문 생성

### 1.1 사용자 흐름

| 순서 | 화면 | URL | 설명 |
|------|------|-----|------|
| 1 | 상품 목록 | `http://localhost:3000` | SAP 재고 데이터 기반 상품 그리드 표시 |
| 2 | 상품 상세 | `/products/{materialId}` | 재고 수량 확인 후 장바구니 담기 |
| 3 | 장바구니 | `/cart` | 수량 조정, 삭제 |
| 4 | 주문서 작성 | `/checkout` | 고객 정보 입력, 재고 가용성 최종 검증 |
| 5 | 주문 완료 | `/confirmation/{orderId}` | SAP Sales Order 번호 표시 |

### 1.2 API 호출 흐름

```
[1] 상품 목록 로딩
    GET /api/sap/products?locale=ko
    └─► SAP: GET /sap/opu/odata/sap/API_PRODUCT_SRV/A_Product
    └─► SAP: GET /sap/opu/odata/sap/C_STOCKQTYCURRENTVALUE_3_CDS/
             C_STOCKQTYCURRENTVALUE_3(P_DisplayCurrency='USD')/Results
             ?$filter=Product eq 'MZ-FG-C900' or Product eq '...' and Plant eq '1710'

[2] 상품 상세 로딩
    GET /api/sap/products/{id}?locale=ko
    └─► SAP: GET /sap/opu/odata/sap/API_PRODUCT_SRV/A_Product('{id}')
    └─► SAP: 재고 조회 (위와 동일)

[3] 주문 생성
    POST /api/sap/orders
    └─► SAP: GET  (CSRF 토큰 Fetch)
    └─► SAP: GET  (재고 가용성 검증)
    └─► SAP: POST /sap/opu/odata/sap/API_SALES_ORDER_SRV/A_SalesOrder
             (Deep Insert - Header + Items)
```

### 1.3 SAP OData 주문 생성 Payload

Portal에서 SAP로 전송되는 실제 Sales Order Deep Insert Payload (Header + Item + ScheduleLine):

```json
{
  "SalesOrderType": "OR",
  "SalesOrganization": "1710",
  "DistributionChannel": "10",
  "OrganizationDivision": "00",
  "SoldToParty": "17100003",
  "PurchaseOrderByCustomer": "WEBPORTAL-20260313-143052",
  "RequestedDeliveryDate": "/Date(1774569600000)/",
  "to_Item": {
    "results": [
      {
        "SalesOrderItem": "10",
        "Material": "TG11",
        "RequestedQuantity": "2",
        "RequestedQuantityUnit": "EA",
        "to_ScheduleLine": {
          "results": [{
            "ScheduleLine": "1",
            "RequestedDeliveryDate": "/Date(1774569600000)/",
            "ScheduleLineOrderQuantity": "2",
            "OrderQuantityUnit": "EA"
          }]
        }
      }
    ]
  }
}
```

### 1.4 조직 데이터 매핑

| 필드 | 값 | 설명 |
|------|-----|------|
| SalesOrderType | `OR` | Standard Order (표준 판매 오더) |
| SalesOrganization | `1710` | 판매 조직 (US) |
| DistributionChannel | `10` | 유통 채널 (Direct Sales) |
| OrganizationDivision | `00` | 사업부 (Cross-Division) |
| SoldToParty | `17100003` | 주문자 비즈니스 파트너 번호 |
| Plant | `1710` | 출하 플랜트 (자동 결정) |

### 1.5 판매 가능 자재 목록

| Material ID | 자재명 (EN) | 자재명 (KO) | 현재 재고 | 단위 | E2E 가능 |
|-------------|------------|------------|----------|------|---------|
| **TG11** | **Trading Goods 11** | **상품 11** | **가용** | **EA** | **✅ 권장** |
| **TG12** | **Trading Goods 12** | **상품 12** | **가용** | **EA** | **✅ 권장** |
| MZ-FG-C900 | City Bike C900 | 시티 바이크 C900 | 317 | PC | ⚠️ ATP 미설정 |
| MZ-FG-C950 | City Bike C950 | 시티 바이크 C950 | 69 | PC | ⚠️ ATP 미설정 |
| MZ-FG-C990 | City Bike C990 | 시티 바이크 C990 | 551 | PC | ⚠️ ATP 미설정 |
| MZ-FG-M500 | Mountain Bike M500 | 마운틴 바이크 M500 | 33 | PC | ⚠️ ATP 미설정 |
| MZ-FG-M525 | Mountain Bike M525 | 마운틴 바이크 M525 | 62 | PC | ⚠️ ATP 미설정 |
| MZ-FG-M550 | Mountain Bike M550 | 마운틴 바이크 M550 | 10 | PC | ⚠️ ATP 미설정 |
| MZ-FG-R100 | Road Bike R100 | 로드 바이크 R100 | 1 | PC | ⚠️ ATP 미설정 |
| MZ-FG-R200 | Road Bike R200 | 로드 바이크 R200 | 1 | PC | ⚠️ ATP 미설정 |
| MZ-FG-R300 | Road Bike R300 | 로드 바이크 R300 | 12 | PC | ⚠️ ATP 미설정 |
| MZ-TG-Y120 | Youth Bike Y120 | 유스 바이크 Y120 | - | PC | ⚠️ ATP 미설정 |
| MZ-TG-Y200 | Youth Bike Y200 | 유스 바이크 Y200 | - | PC | ⚠️ ATP 미설정 |
| MZ-TG-Y240 | Youth Bike Y240 | 유스 바이크 Y240 | - | PC | ⚠️ ATP 미설정 |

> 재고 수량은 Plant 1710 기준 실시간 값이며, SAP CDS View `C_STOCKQTYCURRENTVALUE_3`에서 조회됩니다.

> **⚠️ E2E 데모 시 TG11 또는 TG12 자재를 사용하세요.**
> MZ-FG-* 자재는 Material Master에 ATP(Available-to-Promise) Availability Check Group이 설정되어 있지 않아
> Schedule Line의 Confirmed Quantity가 0으로 남습니다. 이 경우 VL01N에서 Outbound Delivery를 생성할 수 없습니다.
> TG11/TG12는 ATP 설정이 완료되어 있어 주문 생성 → Delivery → GI → Billing까지 전체 O2C 프로세스를 진행할 수 있습니다.

---

## 2단계: SAP S/4HANA — Sales Order 확인 (VA03)

Portal에서 주문이 성공적으로 생성되면 SAP에 Sales Order 문서가 생성됩니다.

### T-Code: VA03 (Display Sales Order)

```
메뉴 경로: Logistics > Sales and Distribution > Sales > Order > Display
```

**입력값:**

| 필드 | 값 | 설명 |
|------|-----|------|
| Order | (Portal에서 반환된 번호) | 예: `0000000123` |

**확인 항목:**

| 탭 | 필드 | 예상 값 |
|-----|------|--------|
| Header > Sales | Order Type | OR (Standard Order) |
| Header > Sales | Sales Organization | 1710 |
| Header > Sales | Distribution Channel | 10 |
| Header > Sales | Division | 00 |
| Header > Sales | Sold-to Party | 17100003 |
| Header > Sales | Purch. Order No. | WEBPORTAL-20260313-143052 |
| Item Overview | Material | MZ-FG-C900 |
| Item Overview | Order Quantity | 2 PC |
| Item Overview | Material | MZ-FG-M500 |
| Item Overview | Order Quantity | 1 PC |
| Item > Schedule Lines | Confirmed Qty | (ATP 확인 수량) |

**VA03 화면 네비게이션:**
```
1. VA03 입력 → Order 번호 입력 → Enter
2. [Header] 버튼 → Sales 탭 → 조직 데이터 확인
3. Item Overview → 자재, 수량, 단위 확인
4. Item 더블클릭 → Schedule Lines 탭 → 확인 수량(Confirmed Qty) 확인
5. [Header] 버튼 → Partners 탭 → Sold-to Party (17100003) 확인
6. [Status Overview] 버튼 → 문서 전체 상태 확인
```

---

## 3단계: SAP S/4HANA — Outbound Delivery 생성 (VL01N)

Sales Order가 생성되면 출하를 위한 Delivery 문서를 생성합니다.

### T-Code: VL01N (Create Outbound Delivery with Order Reference)

```
메뉴 경로: Logistics > Sales and Distribution > Shipping > Outbound Delivery > Create > Single Document > With Reference to Sales Order
```

**입력값:**

| 필드 | 값 | 설명 |
|------|-----|------|
| Shipping Point | 1710 | 출하 포인트 |
| Selection Date | (배송 요청일 이후 날짜) | 주문의 RequestedDeliveryDate 이후 날짜 입력 (예: 주문일+7일) |
| Order | (VA03에서 확인한 번호) | Sales Order 번호 |

> **중요:** Selection Date는 Sales Order의 Schedule Line에 있는 Confirmed Delivery Date 이후로 설정해야 합니다.
> Portal에서 생성된 주문의 배송 요청일은 주문일 + 7일로 설정되므로, Selection Date도 해당 날짜 이후로 입력하세요.

**실행 절차:**
```
1. VL01N 입력
2. Shipping Point: 1710
3. Selection Date: (주문일 + 7일 이후)
4. Order: (Sales Order 번호) 입력
5. Enter → Delivery 문서 자동 생성
6. Item Overview에서 Delivery Qty 확인
   - Material: TG11, Delivery Qty: 2 EA
7. [Picking] 탭 → Picked Qty 입력 (= Delivery Qty)
8. Save (Ctrl+S) → Delivery 번호 확인 (예: 80000123)
```

**확인 항목:**

| 필드 | 값 |
|------|-----|
| Shipping Point | 1710 |
| Delivery Type | LF (Standard Delivery) |
| Ship-to Party | 17100003 |
| Planned GI Date | 2024.11.01 |

### T-Code: VL03N (Display Outbound Delivery)

생성된 Delivery를 확인합니다.

```
VL03N → Delivery 번호 입력 → Enter
- Document Flow (Ctrl+Shift+F5) → Sales Order와의 연결 확인
```

---

## 4단계: SAP S/4HANA — Goods Issue / 출고 (VL02N)

Delivery 문서에서 실제 상품 출고(Goods Issue)를 수행합니다.

### T-Code: VL02N (Change Outbound Delivery)

```
메뉴 경로: Logistics > Sales and Distribution > Shipping > Outbound Delivery > Change > Single Document
```

**입력값:**

| 필드 | 값 | 설명 |
|------|-----|------|
| Delivery | (3단계에서 생성된 번호) | 예: `80000123` |

**실행 절차:**
```
1. VL02N 입력
2. Delivery 번호 입력 → Enter
3. Picking 탭에서 Picked Quantity가 Delivery Quantity와 일치하는지 확인
4. 메뉴: Post Goods Issue 클릭
   또는 Ctrl+Shift+F9
5. 확인 메시지: "Goods issue for delivery 80000123 has been posted"
6. Save
```

**Goods Issue 전기 후 결과:**

| 항목 | 변경 내용 |
|------|----------|
| 재고 | Plant 1710의 해당 자재 재고 차감 |
| 자재 문서 | 자재 이동 전기 (Movement Type 601) |
| 회계 전표 | 매출원가(COGS) / 재고 계정 전기 자동 생성 |
| Delivery 상태 | "C" (Completely Processed) |

### Goods Issue 확인: T-Code MB03 (Display Material Document)

```
MB03 → Material Document 번호 / Year 입력 → Enter
- Movement Type: 601 (GI for delivery)
- Plant: 1710
- Material: MZ-FG-C900
- Quantity: 2 PC (마이너스)
```

### 재고 확인: T-Code MMBE (Stock Overview)

```
MMBE → Material: MZ-FG-C900 → Plant: 1710 → Enter
- Unrestricted Stock가 2만큼 감소했는지 확인
```

---

## 5단계: SAP S/4HANA — Billing / 대금 청구 (VF01)

출하가 완료되면 고객에게 대금을 청구하는 Billing Document를 생성합니다.

### T-Code: VF01 (Create Billing Document)

```
메뉴 경로: Logistics > Sales and Distribution > Billing > Billing Document > Create
```

**입력값:**

| 필드 | 값 | 설명 |
|------|-----|------|
| Document | (Delivery 번호) | 예: `80000123` |
| Billing Type | F2 | Invoice (자동 결정) |
| Billing Date | (오늘 날짜) | 예: 2026.03.13 |

**실행 절차:**
```
1. VF01 입력
2. Document: Delivery 번호 입력 → Enter
3. Billing 문서 미리보기 확인
   - Payer: 17100003
   - Net Value: (자재 가격 합계)
   - Tax: (세금 자동 계산)
4. Save (Ctrl+S) → Billing Document 번호 확인 (예: 90000123)
5. 확인 메시지: "Document 90000123 has been saved"
```

**Billing Document 확인 항목:**

| 필드 | 값 |
|------|-----|
| Billing Type | F2 (Invoice) |
| Sales Organization | 1710 |
| Payer | 17100003 |
| Billing Date | 2026.03.13 |
| Item: Material | MZ-FG-C900 |
| Item: Billed Quantity | 2 PC |
| Item: Net Value | (단가 × 수량) |

### T-Code: VF03 (Display Billing Document)

```
VF03 → Billing Document 번호 입력 → Enter
- Header → 금액 및 세금 확인
- Items → 자재별 청구 수량 및 금액 확인
- [Accounting] 버튼 → 회계 전표 번호 확인
```

---

## 6단계: SAP S/4HANA — Accounting / 회계 전기 (자동)

Billing Document가 저장되면 FI(Financial Accounting) 전표가 자동으로 생성됩니다.

### 자동 생성되는 회계 전표

| 차변 (Debit) | 대변 (Credit) |
|-------------|-------------|
| 매출채권 (Accounts Receivable) | 매출 (Revenue) |
| | 매출세 (Output Tax) |

### T-Code: FB03 (Display Financial Document)

```
FB03 → Document Number / Company Code (1710) / Fiscal Year 입력 → Enter

확인 항목:
- Posting Date: 2026.03.13
- Document Type: RV (Billing Document)
- Line Items:
  - 차변: Customer Account (17100003) - 총 청구금액
  - 대변: Revenue Account - 순매출액
  - 대변: Tax Account - 세금
```

### T-Code: FBL5N (Customer Line Items)

고객 계정의 미결 항목(Open Items)을 확인합니다.

```
FBL5N
- Customer Account: 17100003
- Company Code: 1710
- Open Items 선택
→ 해당 Billing에 대한 미결 채권 확인
```

---

## 7단계: SAP S/4HANA — Document Flow 확인

### T-Code: VA03 → Document Flow

전체 프로세스의 문서 흐름을 한눈에 확인할 수 있습니다.

```
VA03 → Sales Order 번호 입력 → Enter
→ 메뉴: Environment > Display Document Flow
   또는 Ctrl+Shift+F5
```

**Document Flow 예상 결과:**

```
Sales Order         0000000123    ✓ Completed
  │
  ├── Delivery      0080000123    ✓ Completed
  │     │
  │     ├── GI Mat.Doc  4900000456    ✓ Posted
  │     │     │
  │     │     └── Accounting Doc  5100000789    ✓ Posted (COGS)
  │     │
  │     └── Billing Doc  0090000123    ✓ Completed
  │           │
  │           └── Accounting Doc  5100000790    ✓ Posted (Revenue)
```

---

## 전체 T-Code 요약

### Order-to-Cash 실행 순서

| 순서 | T-Code | 트랜잭션명 | 용도 | 입력값 |
|------|--------|-----------|------|--------|
| 1 | **VA03** | Display Sales Order | 주문 확인 | Order: (Portal에서 반환된 번호) |
| 2 | **VL01N** | Create Outbound Delivery | 출하 생성 | Shipping Point: `1710`, Order: (주문번호) |
| 3 | **VL02N** | Change Outbound Delivery | 출고 (Post Goods Issue) | Delivery: (2에서 생성된 번호) |
| 4 | **VF01** | Create Billing Document | 청구서 생성 | Document: (2에서 생성된 번호) |
| 5 | **VA03** | Display Sales Order | Document Flow 확인 | Order: (주문번호) → Ctrl+Shift+F5 |

### 조회/확인용 T-Code

| T-Code | 트랜잭션명 | 용도 |
|--------|-----------|------|
| **VA03** | Display Sales Order | 판매 오더 조회 |
| **VL03N** | Display Outbound Delivery | 출하 문서 조회 |
| **VF03** | Display Billing Document | 청구 문서 조회 |
| **MB03** | Display Material Document | 자재 문서 조회 (Goods Issue 확인) |
| **MMBE** | Stock Overview | 자재별 재고 현황 조회 |
| **FB03** | Display Financial Document | 회계 전표 조회 |
| **FBL5N** | Customer Line Items | 고객 계정 미결/결제 항목 조회 |
| **MM60** | Materials Planning - Multi-Level | 자재 소요량 확인 |
| **VA05** | List of Sales Orders | 판매 오더 리스트 조회 |

---

## 전체 E2E 시나리오 체크리스트

### 사전 조건
- [ ] SAP S/4HANA 시스템 접속 가능 (URL: `https://sap-demo.perfectwin-erp-edition.com`)
- [ ] 사용자 계정: `BPINST` / `Welcome1` (Client 100)
- [ ] Web Portal 실행 중 (`npm run dev` → `http://localhost:3000`)
- [ ] 자재 재고 충분 여부 확인 (MMBE)

### 실행 단계
- [ ] **Web Portal**: 상품 선택 → 장바구니 → 주문서 작성 → 주문하기
- [ ] **VA03**: Portal에서 반환된 SAP Order 번호로 주문 확인
- [ ] **VL01N**: Shipping Point `1710`, Sales Order 번호로 Delivery 생성
- [ ] **VL02N**: Delivery 열고 Post Goods Issue 실행
- [ ] **MMBE**: 재고 차감 확인 (예: MZ-FG-C900 재고가 2 감소)
- [ ] **VF01**: Delivery 번호로 Billing Document 생성
- [ ] **FB03**: 회계 전표 자동 생성 확인 (매출채권 / 매출)
- [ ] **VA03**: Document Flow에서 전체 문서 흐름 확인 (모두 ✓ 상태)

### 기대 결과
1. SAP에 Sales Order가 정상 생성됨
2. Delivery → Goods Issue → Billing → Accounting 전체 프로세스 완료
3. 자재 재고가 주문 수량만큼 차감됨
4. 고객 계정에 매출채권이 생성됨
5. Document Flow에서 모든 후속 문서가 연결되어 표시됨

---

## SAP GUI 접속 정보

| 항목 | 값 |
|------|-----|
| WebGUI URL | `https://sap-demo.perfectwin-erp-edition.com/sap/bc/gui/sap/its/webgui` |
| Client | `100` |
| User | `BPINST` |
| Password | `Welcome1` |
| Language | `EN` 또는 `KO` |

> WebGUI 접속 시 URL 파라미터: `?sap-client=100&sap-language=EN`
>
> T-Code 실행: WebGUI 상단 Command Field에 T-Code 입력 후 Enter

---

## 트러블슈팅

### Portal에서 주문 실패 시
| 증상 | 원인 | 해결 |
|------|------|------|
| "Insufficient stock" 오류 | 요청 수량 > 가용 재고 | MMBE에서 재고 확인, 수량 줄여서 재시도 |
| "Failed to create order" | SAP 접속 불가 또는 인증 오류 | `.env.local` 확인, SAP 시스템 상태 확인 |
| CSRF 토큰 오류 | 세션 만료 | 페이지 새로고침 후 재시도 |

### SAP 후속 프로세스 실패 시
| 증상 | 원인 | 해결 |
|------|------|------|
| VL01N "No schedule lines due for delivery" | MZ-FG-* 자재의 ATP 미설정 (ConfirmedQty=0) | **TG11 또는 TG12 자재로 주문 재생성** |
| VL01N "No schedule lines due for delivery" | Selection Date가 Confirmed Delivery Date 이전 | Selection Date를 주문일+7일 이후로 설정 |
| VL01N에서 Delivery 생성 불가 | Schedule Line 미확인 | VA02에서 Schedule Lines 확인/수정 |
| Post Goods Issue 실패 | 재고 부족 | MMBE에서 재고 확인, MB1C로 재고 입고 |
| VF01에서 Billing 생성 불가 | Goods Issue 미완료 | VL02N에서 PGI 먼저 수행 |
| 회계 전표 미생성 | 계정 결정 오류 | VKOA (Revenue Account Determination) 확인 |

### ATP(Available-to-Promise) 관련 참고사항

MZ-FG-* (바이크) 자재들은 Material Master의 MRP/Sales 뷰에 Availability Check Group이 설정되어 있지 않아
Sales Order 생성 시 Schedule Line의 Confirmed Quantity가 0으로 남습니다.

**영향:** VL01N에서 Outbound Delivery를 생성할 수 없음

**해결 방법:**
1. **(권장)** TG11 또는 TG12 자재로 E2E 데모 진행
2. SAP에서 Material Master (MM02) → MRP 3 뷰 → Availability Check 필드 설정 (예: 02)
3. Material Master (MM02) → Sales: General/Plant Data 뷰 → Checking Group 설정
