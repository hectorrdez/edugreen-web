import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Button from "../../../composables/controls/Button";
import Page from "../../../layouts/Page";
import Section from "../../../layouts/Section";
import Column from "../../../layouts/column/Column";
import Row from "../../../layouts/row/Row";

export default function Login() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      <Section>
        <Row className="justify-center">
          <Column className="w-1/2">
            <form>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <Button type="submit">Login</Button>
            </form>
          </Column>
        </Row>
      </Section>
    </Page>
  );
}
