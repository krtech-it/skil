import { PropsWithChildren } from "react";
import {
  Page,
  Text as _Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image as _Image
} from "@react-pdf/renderer";
import { PageSize } from "@react-pdf/types";
import Logo from "src/assets/Logo.png";
import OnestRegular from "src/services/fonts/OnestRegular.woff";
import OnestBold from "src/services/fonts/OnestBold.woff";

Font.register({ family: "Onest", fontStyle: "normal", src: OnestRegular });
Font.register({ family: "Onest", fontStyle: "bold", src: OnestBold });

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    width: "100%",
    fontFamily: "Onest"
  },
  section: {
    alignItems: "center",
    textAlign: "center",
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    fontStyle: "bold",
    fontWeight: 800,
    fontSize: 48
  },
  title: {
    fontStyle: "bold",
    fontWeight: 700,
    fontSize: 28,
    marginTop: 30,
  },
  text: {
    marginTop: 100,
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 28
  },
  image: {
    width: 64,
    height: 64
  },
  table: {
    width: '100%',
  },
  row: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 8,
    paddingBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  col1: {
    width: '25%',
    fontSize: 15, 
  },
  col2: {
    width: '50%',
    fontSize: 15, 
  },
  col3: {
    width: '25%',
    fontSize: 15, 
  },
});

const Header = ({ children }: PropsWithChildren) => (
  <_Text style={styles.header}>{children}</_Text>
);

const Title = ({ children }: PropsWithChildren) => (
  <_Text style={styles.title}>{children}</_Text>
);

const Text = ({ children }: PropsWithChildren) => (
  <_Text style={styles.text}>{children}</_Text>
);

const Image = ({ src }: { src: any }) => (
  <_Image src={src} style={styles.image} />
);


const data: any = [];
export const PDFDocument = (
  honors: boolean,
  topic: string,
  fullName: string,
  size: PageSize,
  tableData: any = []
): JSX.Element => (
  <Document>
    <Page size={size} style={styles.page}>
      <View style={styles.section}>
        <Image src={Logo} />
        <Header>{honors ? `Диплом с отличием` : `Диплом`}</Header>
        <_Text style={{fontSize: 28, fontWeight: 'bold'}}>{`о прохождении курса`}</_Text>
        <Title>{`По теме: ${topic}`}</Title>
        <Text>{`Студент: ${fullName}`}</Text>
        <Text>{`Подпись ответственного _______________`}</Text>
      </View>
    </Page>
    <Page size={size} style={styles.page} orientation="landscape">
      <View style={styles.section}>
      <_Text style={{fontSize: 14, textAlign: 'left'}}>Приложение к диплому</_Text>
      <View style={styles.table}>
      <View style={[styles.row, styles.bold, styles.header]}>
        <_Text style={styles.col1}>Задание</_Text>
        <_Text style={styles.col2}>Время(мин.)</_Text>
        <_Text style={styles.col3}>Оценка</_Text>
      </View>
      {tableData.map((row: any, i: number) => (
        <View key={i} style={styles.row} wrap={false}>
          <_Text style={styles.col1}>
            <_Text style={styles.bold}>{row.title}</_Text>
          </_Text>
          <_Text style={styles.col2}>{row.time}</_Text>
          <_Text style={styles.col3}>{row.grade}</_Text>
        </View>
      ))}
      <Text>{`Подпись ответственного _______________`}</Text>
    </View>
      </View>
    </Page>
  </Document>
);
