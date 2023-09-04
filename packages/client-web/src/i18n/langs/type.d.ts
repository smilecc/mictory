import { MictoryErrorCodes } from "@mictory/common";
type ErrorsKey = keyof typeof MictoryErrorCodes;

type MictoryTranslationErrors = {
  [k in ErrorsKey]: string;
};

type MictoryTranslation = {
  errors: MictoryTranslationErrors;
};
