// components/PDFDocument.tsx
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
    fontSize: 24,
    marginBottom: 12,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: "Roboto",
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
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Техническое задание</Text>
        <Text style={styles.subtitle}>Общая информация</Text>
        <Text style={styles.text}>Адрес: {data.address}</Text>
        <Text style={styles.text}>Площадь: {data.area} sq.m.</Text>
        <Text style={styles.text}>
          Номер договора (если есть): {data.contractNumber}
        </Text>
        {/* <Text style={styles.text}>
          Start Date: {new Date(data.startDate).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>
          Final Date: {new Date(data.finalDate).toLocaleDateString()}
        </Text> */}

        <Text style={styles.subtitle}>Информация о проживающих</Text>
        {residents.adults.map((person) => (
          <div>
            <Text style={styles.text}>Рост: {person.height}</Text>
            <Text style={styles.text}>Пол: {person.gender}</Text>
          </div>
        ))}
        {residents.children.map((child) => (
          <Text style={styles.text}>Дети: {child.age}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default PDFDocument;
