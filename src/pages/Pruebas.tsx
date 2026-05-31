import ChallengeCard from "../components/cards/ChallengeCard";
import Page from "../components/layouts/Page";
import ChallengeImageTest from "../assets/challenge_image_test.jpg";

export default function PruebasPage() {
  return (
    <Page className="p-4 justify-center flex w-full">
      <ChallengeCard
        imageSrc={ChallengeImageTest}
        title="Usa botellas de cristal"
        link="/access/register"
        typeOfChallenge="padre"
        points={50}
        participants={100}
        classProgress={12.5}
      >
        Reemplaza tus botellas de plastico de un solo uso por vidrio o alumnio
        durante toda la semana.
      </ChallengeCard>
    </Page>
  );
}
