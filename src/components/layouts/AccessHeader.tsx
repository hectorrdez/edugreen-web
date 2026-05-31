import { Link } from "react-router-dom";
import { LogoWithText } from "../Logo";

export default function AccessHeader() {
  return (
    <header className="bg-main py-4 pt-6 px-4 flex justify-center items-center">
      <Link to="/">
        <LogoWithText iconClassName="text-black bg-primary p-2 rounded-logo" />
      </Link>
    </header>
  );
}
