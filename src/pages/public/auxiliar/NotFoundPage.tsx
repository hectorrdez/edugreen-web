import ButtonLink from "../../../components/controls/ButtonLink";
import Page from "../../../components/layouts/Page";
import Column from "../../../components/placing/Column";
import Row from "../../../components/placing/Row";

export default function NotFoundPage() {
  return (
    <Page className="flex flex-col justify-center items-center">
      <Row className="gap-2">
        <Column className="flex-1 items-center font-bold text-secondary gap-0">
          <span className="text-[150px] leading-none">404</span>
          <span className="text-5xl leading-none">NOT FOUND</span>
        </Column>
        <Column className="flex-1 gap-2 justify-between">
          <h1 className="text-xl font-semibold text-secondary">
            Oh, vaya! Algo malo ha ocurrido
          </h1>
          <p className="max-w-sm text-md font-medium text-secondary italic">
            Parece que el recurso que estas buscando no existe o no se encuentra
            en esta dirección. Puedes volver a la página principal con el
            siguiente botón.
          </p>
          <ButtonLink to="/" target="_self">
            Ir a inicio
          </ButtonLink>
        </Column>
      </Row>
    </Page>
  );
}
