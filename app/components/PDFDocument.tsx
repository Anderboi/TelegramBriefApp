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
} from "@/lib/schemas";

// Регистрация шрифтов для поддержки кириллицы
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

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "ultrabold",
    marginBottom: 24,
    textTransform: "uppercase",
    borderBottom: "1 solid #000",
  },
  section: {
    marginBottom: 24,
    borderBottom: "1 solid #000",
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: "#666",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    gap: 20,
  },
  gridKey: {
    flex: 1,
  },
  gridValue: {
    flex: 2,
  },
  gridItem: {
    flex: 1,
  },
  table: {
    marginTop: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #ddd",
    paddingVertical: 4,
  },
  tableCell: {
    fontSize: 9,
    flex: 1,
  },
  listItem: {
    fontSize: 9,
    marginBottom: 3,
    paddingLeft: 10,
  },
});

interface BriefPDFDocumentProps {
  commonData: CommonFormValues;
  residentsData?: ResidentsFormValues;
  premisesData?: PremisesFormValues;
  constructionData?: ConstructionFormValues;
  demolitionData?: DemolitionType;
  equipmentData?: EquipmentBlockFormValues;
}

const BriefPDFDocument: React.FC<BriefPDFDocumentProps> = ({
  commonData,
  residentsData,
  premisesData,
  constructionData,
  demolitionData,
  equipmentData,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Общие данные</Text>

        {/* Раздел 1: Информация о клиенте */}
        <View style={styles.section}>
          <View style={styles.grid}>
            <View style={styles.gridKey}>
              <Text style={styles.sectionTitle}>Раздел 1</Text>
              <Text style={styles.sectionSubtitle}>Информация о клиенте</Text>
            </View>
            <View style={styles.gridValue}>
              <View>
                <Text style={styles.label}>ФИО</Text>
                <Text style={styles.value}>
                  {commonData.clientSurname} {commonData.clientName}
                </Text>
              </View>

              <View>
                <Text style={styles.label}>Номер телефона</Text>
                <Text style={styles.value}>{commonData.phone || "—"}</Text>
              </View>

              <View>
                <Text style={styles.label}>Электронная почта</Text>
                <Text style={styles.value}>{commonData.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Раздел 2: Информация об объекте */}
        <View style={styles.section}>
          <View style={styles.grid}>
            <View style={styles.gridKey}>
              <Text style={styles.sectionTitle}>Раздел 2</Text>
              <Text style={styles.sectionSubtitle}>Информация об объекте</Text>
            </View>
            <View style={styles.gridValue}>
              <View>
                <Text style={styles.label}>Адрес</Text>
                <Text style={styles.value}>{commonData.address}</Text>
              </View>
              <View>
                <Text style={styles.label}>Площадь</Text>
                <Text style={styles.value}>{commonData.area} кв.м.</Text>
              </View>

              <View>
                <Text style={styles.label}>Договор</Text>
                <Text style={styles.value}>
                  {commonData.contractNumber || "—"}
                </Text>
              </View>
              <View>
                <Text style={styles.label}>Бюджет</Text>
                <Text style={styles.value}>—</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Раздел 3: Информация о проживающих */}
        {residentsData && (
          <View style={styles.section}>
            <View style={styles.grid}>
              <View style={styles.gridKey}>
                <Text style={styles.sectionTitle}>Раздел 3</Text>
                <Text style={styles.sectionSubtitle}>
                  Информация о проживающих
                </Text>
              </View>
              <View style={styles.gridValue}>
                <View>
                  <Text style={styles.label}>
                    Кол-во единовременно проживающих
                  </Text>
                  <Text style={styles.value}>
                    {residentsData.adults.length} человека
                  </Text>
                </View>

                {residentsData.adults.length > 0 && (
                  <View>
                    <Text style={styles.label}>Взрослые</Text>
                    <View style={styles.table}>
                      {residentsData.adults.map((adult, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCell}>
                            {adult.gender === "male" ? "Мужчина" : "Женщина"}
                          </Text>
                          <Text style={styles.tableCell}>
                            {adult.height} см рост
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {residentsData.children.length > 0 && (
                  <View>
                    <Text style={styles.label}>Дети</Text>
                    <View style={styles.table}>
                      {residentsData.children.map((child, index) => (
                        <View key={index} style={styles.tableRow}>
                          <Text style={styles.tableCell}>Ребёнок</Text>
                          <Text style={styles.tableCell}>{child.age} лет</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {residentsData.hasPets && (
                  <View>
                    <Text style={styles.label}>Домашние животные</Text>
                    <Text style={styles.value}>{residentsData.petDetails}</Text>
                  </View>
                )}

                {residentsData.hobbies && (
                  <View>
                    <Text style={styles.label}>Хобби</Text>
                    <Text style={styles.value}>{residentsData.hobbies}</Text>
                  </View>
                )}

                {residentsData.healthIssues && (
                  <View>
                    <Text style={styles.label}>Проблемы со здоровьем</Text>
                    <Text style={styles.value}>
                      {residentsData.healthIssues}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </Page>

      {/* Страница 2: Помещения и Отделка */}
      {(premisesData || constructionData) && (
        <Page size="A4" style={styles.page}>
          {/* Раздел 4: Состав помещений */}
          {premisesData && (
            <View style={styles.section}>
              <View style={styles.grid}>
                <View style={styles.gridKey}>
                  <Text style={styles.sectionTitle}>Раздел 4</Text>
                  <Text style={styles.sectionSubtitle}>Состав помещений</Text>
                </View>
                <View style={styles.gridValue}>
                  <View style={styles.table}>
                    {premisesData.rooms.map((room, index) => (
                      <View key={index} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>
                          `{room.order}.{room.name}`
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Раздел 5: Информация по монтажу */}
          {constructionData && (
            <View style={styles.section}>
              <View style={styles.grid}>
                <View style={styles.gridKey}>
                  <Text style={styles.sectionTitle}>Раздел 5</Text>
                  <Text style={styles.sectionSubtitle}>
                    Информация по монтажу
                  </Text>
                </View>
                <View style={styles.gridValue}>
                  {constructionData.walls &&
                    constructionData.walls.length > 0 && (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>Стены:</Text>
                        {constructionData.walls.map((wall, index) => (
                          <Text key={index} style={styles.listItem}>
                            • {wall?.type || "—"}
                            {wall?.material && ` (${wall.material})`}
                            {wall?.rooms && ` - ${wall.rooms.length} помещений`}
                          </Text>
                        ))}
                      </View>
                    )}

                  {constructionData.ceiling &&
                    constructionData.ceiling.length > 0 && (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>Потолок:</Text>
                        {constructionData.ceiling.map((ceiling, index) => (
                          <Text key={index} style={styles.listItem}>
                            • {ceiling?.type || "—"}
                            {ceiling?.material && ` (${ceiling.material})`}
                            {ceiling?.rooms &&
                              ` - ${ceiling.rooms.length} помещений`}
                          </Text>
                        ))}
                      </View>
                    )}

                  {constructionData.floor &&
                    constructionData.floor.length > 0 && (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>Напольные покрытия:</Text>
                        {constructionData.floor.map((floor, index) => (
                          <Text key={index} style={styles.listItem}>
                            • {floor?.type || "—"}
                            {floor?.material && ` (${floor.material})`}
                            {floor?.rooms &&
                              ` - ${floor.rooms.length} помещений`}
                          </Text>
                        ))}
                      </View>
                    )}
                </View>
              </View>
            </View>
          )}

          {/* Раздел 6: Демонтаж */}
          {demolitionData && (
            <View style={styles.section}>
              <View style={styles.grid}>
                <View style={styles.gridKey}>
                  <Text style={styles.sectionTitle}>Раздел 6</Text>
                  <Text style={styles.sectionSubtitle}>Демонтаж</Text>
                </View>

                <View style={styles.gridValue}>
                  {demolitionData.planChange && (
                    <View>
                      <Text style={styles.label}>Демонтаж перегородок</Text>
                      <Text style={styles.value}>
                        {demolitionData.planChangeInfo || "Да"}
                      </Text>
                    </View>
                  )}

                  {demolitionData.entranceDoorChange && (
                    <View>
                      <Text style={styles.label}>Замена входной двери</Text>
                      <Text style={styles.value}>
                        {demolitionData.enteranceDoorType || "Да"}
                      </Text>
                    </View>
                  )}

                  {demolitionData.windowsChange && (
                    <View>
                      <Text style={styles.label}>Замена окон</Text>
                      <Text style={styles.value}>
                        {demolitionData.windowsType || "Да"}
                      </Text>
                    </View>
                  )}

                  {demolitionData.furnitureDemolition && (
                    <View>
                      <Text style={styles.label}>
                        Демонтаж встроенной мебели
                      </Text>
                      <Text style={styles.value}>
                        {demolitionData.furnitureToDemolish || "Да"}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </Page>
      )}

      {/* Страница 3: Наполнение помещений */}
      {equipmentData && equipmentData.rooms.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <View style={styles.grid}>
              <View style={styles.gridKey}>
                <Text style={styles.sectionTitle}>Раздел 7</Text>
                <Text style={styles.sectionSubtitle}>Наполнение помещений</Text>
              </View>
              <View style={styles.gridValue}>
                {equipmentData.rooms.map((room, roomIndex) => (
                  <View key={roomIndex} style={{ marginBottom: 15 }}>
                    <Text style={styles.label}>{room.room_name}</Text>
                    {room.equipment && room.equipment.length > 0 ? (
                      <View style={styles.table}>
                        {room.equipment.map((item, itemIndex) => (
                          <View key={itemIndex} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>
                              {item.name}
                            </Text>
                            <Text style={styles.tableCell}>
                              {item.quantity || 1} шт
                            </Text>
                            {item.manufacturer && (
                              <Text style={styles.tableCell}>
                                {item.manufacturer}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.listItem}>—</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default BriefPDFDocument;
