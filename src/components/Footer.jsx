import Row from "../layouts/row/Row";
import Section from "../layouts/Section";

export default function Footer() {
  return (
    <footer>
      <Section className="text-white text-sm bg-black/70">
        <Row className="justify-center font-bold">
          <p>Desarrollado por Héctor Rodríguez para un proyecto educativo</p>
        </Row>
      </Section>
    </footer>
  );
}
