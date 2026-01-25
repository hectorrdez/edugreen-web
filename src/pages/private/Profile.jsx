import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Page from "../../layouts/Page";

export default function Profile() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      Profile
    </Page>
  );
}
