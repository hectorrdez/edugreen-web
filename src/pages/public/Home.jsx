import Page from "../../layouts/Page";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      Home
    </Page>
  );
}
