// @flow
import * as React from "react";
import useStores from "hooks/useStores";

type Props = {|
  documentId: string,
|};

export default function Comments({ documentId }: Props) {
  const { comments } = useStores();

  React.useEffect(() => {
    comments.fetchDocumentComments(documentId);
  }, []);

  return (
    <ul>
      <li>
        <p></p>
      </li>
    </ul>
  );
}
