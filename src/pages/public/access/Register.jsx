import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Button from "../../../composables/controls/Button";
import Page from "../../../layouts/Page";
import Section from "../../../layouts/Section";
import Column from "../../../layouts/column/Column";
import Row from "../../../layouts/row/Row";

export default function Register() {
  return (
    <Page header={<Header />} footer={<Footer />}>
      <Section>
        <Row className="justify-center">
          <Column className="w-1/2">
            <form>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <Button type="submit">Register</Button>
            </form>
          </Column>
        </Row>
      </Section>
    </Page>
  );
}
