import { Link } from "react-router-dom";
import { LogoWithText } from "../Logo";

export default function AccessHeader() {
  return (
    <Link to="/">
      <LogoWithText iconClassName="text-black bg-primary p-2 rounded-logo" />
    </Link>
  );
}
