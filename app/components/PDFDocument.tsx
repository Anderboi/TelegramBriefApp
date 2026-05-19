import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  CommonFormValues,
  ResidentsFormValues,
  PremisesFormValues,
  ConstructionFormValues,
  DemolitionType,
  EquipmentBlockFormValues,
  EngineeringSystemsType,
} from "@/lib/schemas";

// ─── Шрифты ──────────────────────────────────────────────────────────────────
// Используем локальные шрифты — CDN ненадёжен в production
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-black-webfont.ttf",
      fontWeight: "ultrabold",
    },
  ],
});

// ─── Дизайн-токены ───────────────────────────────────────────────────────────
const T = {
  // Цвета
  black: "#0f172a",
  gray700: "#334155",
  gray500: "#64748b",
  gray300: "#cbd5e1",
  gray100: "#f1f5f9",
  accent: "#3d6763", // синий — акцент для номеров разделов
  accentLight: "#e6f2f1",

  // Типографика
  xs: 8,
  sm: 9,
  base: 10,
  md: 11,
  lg: 13,
  xl: 18,
  xxl: 26,

  // Отступы
  page: 40,
  section: 20,
  gap: 8,
} as const;

// ─── Стили ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Страница
  page: {
    paddingTop: T.page,
    paddingBottom: 60, // место для футера
    paddingLeft: T.page,
    paddingRight: T.page,
    fontFamily: "Roboto",
    fontSize: T.base,
    color: T.black,
    backgroundColor: "#ffffff",
  },

  // Шапка документа
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
    paddingBottom: 12,
    borderBottom: `1.5 solid ${T.black}`,
  },
  headerTitle: {
    fontSize: T.xxl,
    fontWeight: "bold",
    color: T.black,
    letterSpacing: 0.5,
  },
  headerMeta: {
    fontSize: T.sm,
    color: T.gray500,
    textAlign: "right",
  },

  // Раздел
  section: {
    marginBottom: T.section,
    paddingBottom: T.section,
    borderBottom: `0.5 solid ${T.gray300}`,
  },
  sectionLast: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  sectionRow: {
    flexDirection: "row",
    gap: 24,
  },

  // Лейбл раздела (левая колонка)
  sectionLabel: {
    width: 120,
    flexShrink: 0,
    paddingTop: 2,
    // relative: true,
  },
  sectionNumber: {
    fontSize: T.xl,
    fontWeight: "black",
    color: T.accent,
    opacity: 0.5,
    letterSpacing: 0.6,
    marginBottom: 0,
    // position:'absolute',
    // top:-20,
  },
  sectionTitle: {
    fontSize: T.md,
    fontWeight: "bold",
    color: T.black,
    lineHeight: 1.4,
  },

  // Контент раздела (правая колонка)
  sectionContent: {
    flex: 1,
  },

  // Поле данных
  field: {
    marginBottom: T.gap,
  },
  fieldLabel: {
    fontSize: T.xs,
    color: T.gray500,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  fieldValue: {
    fontSize: T.base,
    color: T.black,
    lineHeight: 1.5,
  },

  // Таблица
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 4,
    marginBottom: 2,
    borderBottom: `0.5 solid ${T.black}`,
  },
  tableHeaderCell: {
    fontSize: T.sm,
    fontWeight: "bold",
    color: T.gray700,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: `0.5 solid ${T.gray300}`,
  },
  tableCell: {
    fontSize: T.sm,
    color: T.black,
    flex: 1,
  },
  tableCellMuted: {
    fontSize: T.sm,
    color: T.gray500,
    flex: 1,
  },

  // Пункт списка
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 6,
  },
  listBullet: {
    fontSize: T.base,
    color: T.accent,
    width: 10,
  },
  listText: {
    fontSize: T.base,
    flex: 1,
    lineHeight: 1.5,
  },

  // Группа материала (монтаж)
  materialGroup: {
    marginBottom: 10,
  },
  materialGroupTitle: {
    fontSize: T.sm,
    color: T.gray500,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  materialItem: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottom: `0.5 solid ${T.gray100}`,
    gap: 12,
  },
  materialType: {
    width: "45%",
    fontSize: T.base,
    color: T.black,
  },
  materialRooms: {
    flex: 1,
    fontSize: T.base,
    color: T.gray500,
  },

  // Блок подписей
  signatures: {
    marginTop: 40,
    paddingTop: 16,
    borderTop: `0.5 solid ${T.black}`,
  },
  signaturesTitle: {
    fontSize: T.md,
    fontWeight: "bold",
    marginBottom: 20,
    color: T.black,
  },
  signaturesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  signatureBlock: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: T.xs,
    color: T.gray500,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  signatureLine: {
    borderBottom: `0.5 solid ${T.black}`,
    height: 28,
    marginBottom: 6,
  },
  signatureName: {
    fontSize: T.xs,
    color: T.gray500,
    textAlign: "center",
  },

  // Пустое значение
  emptyValue: {
    fontSize: T.base,
    color: T.gray300,
    // fontStyle: "italic",
  },
});

// ─── Типы ────────────────────────────────────────────────────────────────────

interface EngineeringItem {
  system?: string;
  rooms?: string[];
}

interface BriefPDFDocumentProps {
  commonData: CommonFormValues;
  residentsData?: ResidentsFormValues;
  premisesData?: PremisesFormValues;
  constructionData?: ConstructionFormValues;
  demolitionData?: DemolitionType;
  equipmentData?: EquipmentBlockFormValues;
  engineeringData?: EngineeringSystemsType;
  generatedAt?: Date; // стабильная дата — не генерируем при каждом рендере
}

// ─── Атомарные компоненты ─────────────────────────────────────────────────────

// Поле данных
const Field = ({
  label,
  value,
  style,
}: {
  label: string;
  value?: string | null;
  style?: object;
}) => (
  <View style={style ? { ...S.field, ...style } : S.field}>
    <Text style={S.fieldLabel}>{label.toUpperCase()}</Text>
    {value ? (
      <Text style={S.fieldValue}>{value}</Text>
    ) : (
      <Text style={S.emptyValue}>—</Text>
    )}
  </View>
);

// Заголовок раздела (лейбл в левой колонке)
const SectionLabel = ({ number, title }: { number: string; title: string }) => (
  <View style={S.sectionLabel}>
    <Text style={S.sectionNumber}>{number}</Text>
    <Text style={S.sectionTitle}>{title}</Text>
  </View>
);

// Пункт списка с буллетом
const ListItem = ({ text }: { text: string }) => (
  <View style={S.listItem}>
    <Text style={S.listBullet}>·</Text>
    <Text style={S.listText}>{text}</Text>
  </View>
);

// Строка группы материала (монтаж)
const MaterialRow = ({
  type,
  material,
  rooms,
}: {
  type: string;
  material?: string;
  rooms: string;
}) => (
  <View style={S.materialItem}>
    <Text style={S.materialType}>
      {material ? `${type} — ${material}` : type}
    </Text>
    <Text style={S.materialRooms}>{rooms || "—"}</Text>
  </View>
);

// Инженерная категория
const EngineeringCategory = ({
  title,
  items,
}: {
  title: string;
  items?: EngineeringItem[];
}) => (
  <View style={S.materialGroup}>
    <Text style={S.materialGroupTitle}>{title.toUpperCase()}</Text>
    {!items?.length ? (
      <Text style={S.emptyValue}>Не требуется / не указано</Text>
    ) : (
      items.map((item, idx) => (
        <View key={idx} style={S.materialItem}>
          <Text style={S.materialType}>{item.system ?? "—"}</Text>
          <Text style={S.materialRooms}>
            {item.rooms?.length ? item.rooms.join(", ") : "Все помещения"}
          </Text>
        </View>
      ))
    )}
  </View>
);

// Футер страницы
const PageFooter = ({ clientName }: { clientName: string }) => (
  <>
    <Text
      style={{
        position: "absolute",
        fontSize: T.xs,
        bottom: 28,
        left: T.page,
        right: T.page,
        textAlign: "left",
        color: T.gray500,
        borderTop: `0.5 solid ${T.gray300}`,
        paddingTop: 8,
      }}
      render={({ pageNumber, totalPages }) =>
        `Техническое задание · ${clientName} · стр. ${pageNumber} из ${totalPages}`
      }
      fixed
    />
    <Text
      style={{
        position: "absolute",
        fontSize: T.xs,
        bottom: 28,
        left: T.page,
        right: T.page,
        textAlign: "right",
        color: T.gray500,
        paddingTop: 8,
      }}
      render={() => "Заказчик _____________ / Исполнитель _____________"}
      fixed
    />
  </>
);

// Шапка страницы (повторяется на каждой странице начиная со 2й)
const PageHeader = ({
  title,
  clientName,
}: {
  title: string;
  clientName: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 20,
      paddingBottom: 10,
      borderBottom: `0.5 solid ${T.gray300}`,
    }}
  >
    <Text style={{ fontSize: T.base, fontWeight: "bold", color: T.black }}>
      {title}
    </Text>
    <Text style={{ fontSize: T.xs, color: T.gray500 }}>{clientName}</Text>
  </View>
);

// ─── Хелпер ──────────────────────────────────────────────────────────────────

function getRoomNamesByIds(
  roomIds: string[],
  premisesData?: PremisesFormValues,
): string {
  if (!premisesData?.rooms || !roomIds?.length) return "—";

  // Маппинг id → name по индексу (room-0, room-1, ...)
  const roomMap = new Map(
    premisesData.rooms.map((room, index) => [`room-${index}`, room.name]),
  );

  const names = roomIds
    .map((id) => roomMap.get(id))
    .filter(Boolean) as string[];

  return names.length ? names.join(", ") : "—";
}

// ─── Документ ────────────────────────────────────────────────────────────────

const BriefPDFDocument: React.FC<BriefPDFDocumentProps> = ({
  commonData,
  residentsData,
  premisesData,
  constructionData,
  demolitionData,
  equipmentData,
  engineeringData,
  generatedAt,
}) => {
  const dateStr = (generatedAt ?? new Date()).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const clientFullName = [
    commonData.clientSurname,
    commonData.clientName,
    commonData.clientPatronymic,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Document
      title={`Техническое задание — ${clientFullName}`}
      author="Balans"
      subject="Техническое задание на дизайн-проект"
    >
      {/* ══════════════════════════════════════════════════════
          СТРАНИЦА 1: Клиент, объект, проживающие, демонтаж
      ══════════════════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        {/* Шапка */}
        <View style={S.header}>
          <Text style={S.headerTitle}>Техническое задание</Text>
          <View>
            <Text style={S.headerMeta}>{dateStr}</Text>
            {commonData.contractNumber && (
              <Text style={S.headerMeta}>
                Приложение к договору № {commonData.contractNumber}
              </Text>
            )}
          </View>
        </View>

        {/* Раздел 1: Клиент */}
        <View style={S.section}>
          <View style={S.sectionRow}>
            <SectionLabel number="01" title={"Информация\nо клиенте"} />
            <View style={S.sectionContent}>
              <Field label="ФИО" value={clientFullName || "—"} />
              <View style={{ flexDirection: "row", gap: 24 }}>
                <Field
                  label="Телефон"
                  value={commonData.phone}
                  style={{ flex: 1 }}
                />
                <Field
                  label="Email"
                  value={commonData.email}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Раздел 2: Объект */}
        <View style={S.section}>
          <View style={S.sectionRow}>
            <SectionLabel number="02" title={"Объект"} />
            <View style={S.sectionContent}>
              <Field label="Адрес" value={commonData.address} />
              <View style={{ flexDirection: "row", gap: 24 }}>
                <Field
                  label="Площадь"
                  value={
                    commonData.area ? `${commonData.area} кв. м` : undefined
                  }
                  style={{ flex: 1 }}
                />
                <Field
                  label="Сроки"
                  value={
                    commonData.startDate && commonData.finalDate
                      ? `${commonData.startDate} — ${commonData.finalDate}`
                      : undefined
                  }
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Раздел 3: Проживающие */}
        {residentsData && (
          <View style={S.section}>
            <View style={S.sectionRow}>
              <SectionLabel number="03" title={"Проживающие"} />
              <View style={S.sectionContent}>
                {/* Взрослые */}
                {residentsData.adults.length > 0 && (
                  <View style={S.field}>
                    <Text style={S.fieldLabel}>ВЗРОСЛЫЕ</Text>
                    <View style={S.table}>
                      <View style={S.tableHeader}>
                        <Text style={[S.tableHeaderCell, { flex: 1 }]}>
                          Пол
                        </Text>
                        <Text style={[S.tableHeaderCell, { flex: 1 }]}>
                          Рост
                        </Text>
                      </View>
                      {residentsData.adults.map((adult, idx) => (
                        <View key={idx} style={S.tableRow}>
                          <Text style={S.tableCell}>
                            {adult.gender === "male" ? "Мужчина" : "Женщина"}
                          </Text>
                          <Text style={S.tableCell}>{adult.height} см</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Дети */}
                {residentsData.children.length > 0 && (
                  <View style={S.field}>
                    <Text style={S.fieldLabel}>ДЕТИ</Text>
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                    >
                      {residentsData.children.map((child, idx) => (
                        <Text key={idx} style={S.fieldValue}>
                          {child.age}{" "}
                          {child.age === 1
                            ? "год"
                            : child.age < 5
                              ? "года"
                              : "лет"}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Доп. информация */}
                {residentsData.hobbies && (
                  <Field
                    label="Хобби и увлечения"
                    value={residentsData.hobbies}
                  />
                )}
                {residentsData.healthIssues && (
                  <Field
                    label="Ограничения по здоровью"
                    value={residentsData.healthIssues}
                  />
                )}
                {residentsData.hasPets && residentsData.petDetails && (
                  <Field
                    label="Домашние животные"
                    value={residentsData.petDetails}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        {/* Раздел 4: Демонтаж */}
        {demolitionData && (
          <View style={S.section}>
            <View style={S.sectionRow}>
              <SectionLabel number="04" title={"Демонтаж"} />
              <View style={S.sectionContent}>
                {demolitionData.planChange && (
                  <Field
                    label="Демонтаж перегородок"
                    value={demolitionData.planChangeInfo || "Предусмотрен"}
                  />
                )}
                {demolitionData.entranceDoorChange && (
                  <Field
                    label="Замена входной двери"
                    value={demolitionData.enteranceDoorType || "Предусмотрена"}
                  />
                )}
                {demolitionData.windowsChange && (
                  <Field
                    label="Замена окон"
                    value={demolitionData.windowsType || "Предусмотрена"}
                  />
                )}
                {demolitionData.furnitureDemolition && (
                  <Field
                    label="Демонтаж встроенной мебели"
                    value={demolitionData.furnitureToDemolish || "Предусмотрен"}
                  />
                )}
                {demolitionData.isOther && (
                  <Field
                    label="Другие демонтажные работы"
                    value={demolitionData.other || "Предусмотрены"}
                  />
                )}
                {!demolitionData.planChange &&
                  !demolitionData.entranceDoorChange &&
                  !demolitionData.windowsChange &&
                  !demolitionData.furnitureDemolition &&
                  !demolitionData.isOther && (
                    <Text style={S.emptyValue}>
                      Демонтажные работы не предусмотрены
                    </Text>
                  )}
              </View>
            </View>
          </View>
        )}

        <PageFooter clientName={clientFullName} />
      </Page>

      {/* ══════════════════════════════════════════════════════
          СТРАНИЦА 2: Состав помещений и монтаж
      ══════════════════════════════════════════════════════ */}
      {(premisesData || constructionData) && (
        <Page size="A4" style={S.page}>
          <PageHeader title="Техническое задание" clientName={clientFullName} />

          {/* Раздел 5: Помещения */}
          {premisesData && (
            <View style={S.section}>
              <View style={S.sectionRow}>
                <SectionLabel number="05" title={"Состав\nпомещений"} />
                <View style={S.sectionContent}>
                  <View style={S.table}>
                    <View style={S.tableHeader}>
                      <Text style={[S.tableHeaderCell, { width: 24 }]}>№</Text>
                      <Text style={S.tableHeaderCell}>Помещение</Text>
                    </View>
                    {premisesData.rooms.map((room, idx) => (
                      <View key={idx} style={S.tableRow}>
                        <Text
                          style={[S.tableCell, { width: 24, color: T.gray500 }]}
                        >
                          {room.order}
                        </Text>
                        <Text style={S.tableCell}>{room.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Раздел 6: Монтаж */}
          {constructionData && (
            <View style={S.section}>
              <View style={S.sectionRow}>
                <SectionLabel number="06" title={"Информация\nпо монтажу"} />
                <View style={S.sectionContent}>
                  {/* Шапка колонок */}
                  <View style={{ flexDirection: "row", marginBottom: 6 }}>
                    <Text style={[S.fieldLabel, { width: "45%" }]}>
                      ТИП / МАТЕРИАЛ
                    </Text>
                    <Text style={[S.fieldLabel, { flex: 1 }]}>ПОМЕЩЕНИЯ</Text>
                  </View>

                  {/* Стены */}
                  {constructionData.walls?.length > 0 && (
                    <View style={S.materialGroup}>
                      <Text style={S.materialGroupTitle}>СТЕНЫ</Text>
                      {constructionData.walls.map((wall, idx) => (
                        <MaterialRow
                          key={idx}
                          type={wall?.type ?? "—"}
                          material={wall?.material}
                          rooms={getRoomNamesByIds(
                            wall?.rooms ?? [],
                            premisesData,
                          )}
                        />
                      ))}
                    </View>
                  )}

                  {/* Потолок */}
                  {constructionData.ceiling?.length > 0 && (
                    <View style={S.materialGroup}>
                      <Text style={S.materialGroupTitle}>ПОТОЛОК</Text>
                      {constructionData.ceiling.map((item, idx) => (
                        <MaterialRow
                          key={idx}
                          type={item?.type ?? "—"}
                          material={item?.material}
                          rooms={getRoomNamesByIds(
                            item?.rooms ?? [],
                            premisesData,
                          )}
                        />
                      ))}
                    </View>
                  )}

                  {/* Пол */}
                  {constructionData.floor?.length > 0 && (
                    <View style={S.materialGroup}>
                      <Text style={S.materialGroupTitle}>
                        НАПОЛЬНЫЕ ПОКРЫТИЯ
                      </Text>
                      {constructionData.floor.map((item, idx) => (
                        <MaterialRow
                          key={idx}
                          type={item?.type ?? "—"}
                          material={item?.material}
                          rooms={getRoomNamesByIds(
                            item?.rooms ?? [],
                            premisesData,
                          )}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          <PageFooter clientName={clientFullName} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════
          СТРАНИЦА 3: Наполнение помещений
      ══════════════════════════════════════════════════════ */}
      {equipmentData?.rooms && equipmentData?.rooms?.length > 0 && (
        <Page size="A4" style={S.page}>
          <PageHeader title="Техническое задание" clientName={clientFullName} />

          <View style={S.section}>
            <SectionLabel number="07" title={"Наполнение\nпомещений"} />
          </View>

          <View>
            {equipmentData.rooms.map((room, roomIdx) => (
              <View key={roomIdx} style={{ marginBottom: 16 }} wrap={false}>
                {/* Заголовок комнаты */}
                <View
                  style={{
                    backgroundColor: T.accentLight,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: T.base,
                      fontWeight: "bold",
                      color: T.black,
                    }}
                  >
                    {room.room_name}
                  </Text>
                </View>

                {room.equipment?.length ? (
                  <View style={S.table}>
                    {/* Шапка таблицы */}
                    <View style={S.tableHeader}>
                      <Text style={[S.tableHeaderCell, { flex: 3 }]}>
                        Наименование
                      </Text>
                      <Text style={[S.tableHeaderCell, { flex: 1 }]}>
                        Кол-во
                      </Text>
                      <Text style={[S.tableHeaderCell, { flex: 2 }]}>
                        Производитель
                      </Text>
                      <Text style={[S.tableHeaderCell, { flex: 3 }]}>
                        Описание
                      </Text>
                    </View>

                    {room.equipment.map((item, itemIdx) => (
                      //TODO: Сделать строку ссылкой на предмет
                      <View key={itemIdx} style={S.tableRow} wrap={false}>
                        <Text style={[S.tableCell, { flex: 3 }]}>
                          {item.name}
                        </Text>
                        <Text style={[S.tableCell, { flex: 1 }]}>
                          {item.quantity ?? 1} шт.
                        </Text>
                        <Text style={[S.tableCellMuted, { flex: 2 }]}>
                          {item.manufacturer || "—"}
                        </Text>
                        <Text style={[S.tableCellMuted, { flex: 3 }]}>
                          {item.description || "—"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={S.emptyValue}>Наполнение не указано</Text>
                )}
              </View>
            ))}
          </View>

          <PageFooter clientName={clientFullName} />
        </Page>
      )}

      {/* ══════════════════════════════════════════════════════
          СТРАНИЦА 4: Инженерные системы + подписи
      ══════════════════════════════════════════════════════ */}
      {engineeringData && (
        <Page size="A4" style={S.page}>
          <PageHeader title="Техническое задание" clientName={clientFullName} />

          <View style={S.section}>
            <SectionLabel number="08" title={"Инженерные\nсистемы"} />
          </View>

          {/* Шапка колонок */}
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Text style={[S.fieldLabel, { width: "45%" }]}>СИСТЕМА</Text>
            <Text style={[S.fieldLabel, { flex: 1 }]}>ПОМЕЩЕНИЯ</Text>
          </View>

          <EngineeringCategory
            title="Отопление"
            items={engineeringData.heatingSystem}
          />
          <EngineeringCategory
            title="Тёплый пол"
            items={engineeringData.warmFloorRooms}
          />
          <EngineeringCategory
            title="Кондиционирование и вентиляция"
            items={engineeringData.conditioningSystem}
          />
          <EngineeringCategory
            title="Водоочистка и водоснабжение"
            items={engineeringData.purificationSystem}
          />
          <EngineeringCategory
            title="Электрооборудование и умный дом"
            items={engineeringData.electricSystem}
          />

          {/* Блок подписей */}
          <View style={S.signatures} wrap={false}>
            <Text style={S.signaturesTitle}>
              Техническое задание согласовано:
            </Text>
            <View style={S.signaturesRow}>
              <View style={S.signatureBlock}>
                <Text style={S.signatureLabel}>ЗАКАЗЧИК</Text>
                <View style={S.signatureLine} />
                <Text style={S.signatureName}>
                  {commonData.clientSurname} {commonData.clientName}
                </Text>
              </View>
              <View style={S.signatureBlock}>
                <Text style={S.signatureLabel}>ИСПОЛНИТЕЛЬ (ДИЗАЙНЕР)</Text>
                <View style={S.signatureLine} />
                <Text style={S.signatureName}>ФИО дизайнера</Text>
              </View>
            </View>
          </View>

          <PageFooter clientName={clientFullName} />
        </Page>
      )}
    </Document>
  );
};

export default BriefPDFDocument;
