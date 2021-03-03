FROM alpine AS get_saved_model

ARG MODEL_URL="https://tfhub.dev/google/universal-sentence-encoder-multilingual-large/3?tf-hub-format=compressed"

RUN wget ${MODEL_URL} -O model.tar.gz
RUN mkdir model && tar -xvzf model.tar.gz -C model

FROM tensorflow/serving:2.4.0

ENV PORT=8501
EXPOSE ${PORT}

ENV MODEL_BASE_PATH=/models
ENV MODEL_NAME=useml
ENV MODEL_VERSION=3

COPY --from=get_saved_model model ${MODEL_BASE_PATH}/${MODEL_NAME}/${MODEL_VERSION}

ENTRYPOINT exec tensorflow_model_server --rest_api_port=${PORT} --model_name=${MODEL_NAME} --model_base_path=${MODEL_BASE_PATH}/${MODEL_NAME}
