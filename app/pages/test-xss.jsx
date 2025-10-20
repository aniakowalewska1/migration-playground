// pages/test-xss.jsx
import XssSeed from "../security/xss-sink.jsx";

export default function TestPage({ userInput }) {
  return <XssSeed userContent={userInput} />;
}

export async function getServerSideProps(context) {
  return { props: { userInput: context.query.content || "" } };
}
