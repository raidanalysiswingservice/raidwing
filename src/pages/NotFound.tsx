import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@solar-icons/react/outline/arrow-right";
import { PageHeader } from "../components/Ui";
import { makeRef } from "../lib/format";

export default function NotFound() {
  return (
    <div className="page-body">
      <div className="container">
        <PageHeader
          eyebrow="Error 404"
          title="Record not found"
          intro="The page you asked for is not in this register. Check the address, or continue from the homepage."
          refCode={makeRef("404")}
        />
        <div className="prose">
          <p>
            <Link to="/" className="block-link">
              Return to the homepage <ArrowRightIcon size={14} />
            </Link>
          </p>
          <p>
            <Link to="/contact" className="block-link">
              Report a broken link <ArrowRightIcon size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
