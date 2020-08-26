// @flow
import { observer } from "mobx-react";
import * as React from "react";
import Button from "components/Button";
import Input from "components/Input";
import useStores from "hooks/useStores";

type Props = {|
  documentId: string,
|};

function Comments({ documentId }: Props) {
  const { comments } = useStores();
  const [draftComment, setDraftComment] = React.useState("");
  const [isSubmitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    comments.fetchDocumentComments(documentId);
  }, [comments, documentId]);

  const handleInputChange = React.useCallback((event) => {
    setDraftComment(event.target.value);
  }, []);

  const handleSubmit = React.useCallback(
    async (event) => {
      event.preventDefault();
      let previous = draftComment;

      try {
        setSubmitting(true);
        setDraftComment("");
        await comments.create({
          text: draftComment,
          documentId,
          from: 0,
          to: 0,
        });
      } catch (err) {
        setDraftComment(previous);
      } finally {
        setSubmitting(false);
      }
    },
    [comments, documentId, draftComment]
  );

  return (
    <>
      <ul>
        {comments.document(documentId).map((comment) => (
          <li>
            <p>{comment.text}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <Input
          value={draftComment}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting}>
          Send
        </Button>
      </form>
    </>
  );
}

export default observer(Comments);
