import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  CommonFormValues,
  ResidentsFormValues,
  PremisesFormValues,
} from "@/lib/schemas";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Roboto",
  },
  infoblock: {
    flexDirection: "row",
  },
  infoblockTitle: {
    color: "#929292",
    width: "35%",
  },
  stageblock: {
    flexDirection: "column",
    gap: "8px",
    paddingBottom: "24px",
  },
});

interface PDFDocumentProps {
  data: CommonFormValues;
  residents: ResidentsFormValues;
  premises: PremisesFormValues;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({
  data,
  residents,
  premises,
}) => (
  <Document title="Техническое задание" language="ru">
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Техническое задание</Text>
        <View style={styles.infoblock}>
          <Text style={[styles.text, styles.infoblockTitle]}>
            Номер договора (если есть)
          </Text>
          <Text style={styles.text}>{data.contractNumber}</Text>
        </View>
        <Text style={styles.subtitle}>Общая информация</Text>
        {/* //! Common Block */}
        <View style={styles.stageblock}>
          <View style={styles.infoblock}>
            <Text style={[styles.text, styles.infoblockTitle]}>Клиент</Text>
            <Text style={styles.text}>{data.area} </Text>
          </View>

          <View style={styles.infoblock}>
            <Text style={[styles.text, styles.infoblockTitle]}>Адрес</Text>
            <Text style={styles.text}>{data.address}</Text>
          </View>

          <View style={styles.infoblock}>
            <Text style={[styles.text, styles.infoblockTitle]}>
              Площадь объекта
            </Text>
            <Text style={styles.text}>{data.area} м²</Text>
          </View>

          <View style={styles.infoblock}>
            <Text style={[styles.text, styles.infoblockTitle]}>
              Цель использования
            </Text>
            <Text style={styles.text}>{data.area} м²</Text>
          </View>

          <View style={styles.infoblock}>
            <Text style={[styles.text, styles.infoblockTitle]}>
              Количество проживающих
            </Text>
            <Text style={styles.text}>
              {residents.adults.length + residents.children.length} чел.
            </Text>
          </View>

          <View style={styles.infoblock}>
            <Text style={[styles.text, styles.infoblockTitle]}>
              Дата начала проекта
            </Text>
            <Text style={styles.text}>
              {data.startDate || new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* //! Информация о проживающих */}
        <Text style={styles.subtitle}>Информация о проживающих</Text>
        <View style={styles.stageblock}>
          {residents.adults.map((person, idx) => (
            <div key={idx} style={{ gap: "4px" }}>
              <View style={styles.infoblock}>
                <Text style={[styles.text, styles.infoblockTitle]}>Рост</Text>
                <Text style={styles.text}>{person.height}</Text>
              </View>
              <View style={styles.infoblock}>
                <Text style={[styles.text, styles.infoblockTitle]}>Пол</Text>
                <Text style={styles.text}>
                  {person.gender === ""
                    ? ""
                    : person.gender === "man"
                    ? "Мужской"
                    : "Женский"}
                </Text>
              </View>
            </div>
          ))}
          {residents.children.map((child, idx) => (
            <View key={idx} style={styles.infoblock}>
              <Text style={[styles.text, styles.infoblockTitle]}>Дети</Text>
              <Text style={styles.text}>{child.age}</Text>
            </View>
          ))}
        </View>
        {/* //! Состав помещений */}
        <Text style={styles.subtitle}>Состав помещений</Text>
        <View style={styles.stageblock}>
          {premises.rooms.map((room, idx) => (
            <View key={idx} style={styles.infoblock}>
              <Text style={[styles.text, styles.infoblockTitle]}>
                {room.order}
                {room.name}
              </Text>
              <Text style={styles.text}></Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
