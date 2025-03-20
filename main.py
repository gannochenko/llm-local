from llama_cpp import Llama


# GLOBAL VARIABLES
zephyr_model_path = "./zephyr-model.gguf"
deepseek_model_path = "./deepseek-model.gguf"
CONTEXT_SIZE = 512


zephyr_llm = Llama(
                    model_path=zephyr_model_path,
                    chat_format="llama-2",
                    n_ctx=4096,
                    n_threads=8,
                    #n_ctx=CONTEXT_SIZE
)

# deepseek_llm = Llama(
#                     model_path=deepseek_model_path,
#                     chat_format="llama-2"
# )

# def generate_text_from_prompt(user_prompt,
#                              max_tokens = 100,
#                              temperature = 0.3,
#                              top_p = 0.1,
#                              echo = True,
#                              stop = ["Q", "\n"]):

#    # Define the parameters
#    model_output = zephyr_llm(
#        user_prompt,
#        max_tokens=max_tokens,
#        temperature=temperature,
#        top_p=top_p,
#        echo=echo,
#        stop=stop,
#    )


#    return model_output


def generate_text_from_prompt_v2(user_prompt = "",
                             max_tokens = 100,
                             temperature = 0.3,
                             top_p = 0.1,
                             echo = True,
                             stop = ["Q", "\n"]):

   # Define the parameters
   model_output = zephyr_llm.create_chat_completion(
      messages = [
          {"role": "system", "content": "You are an expert in the AI."},
          {
              "role": "user", # can also be "assistant"
              "content": "explain how AI works, in short."
          }
      ],
      stream=True
   )

   for chunk in model_output:
      delta = chunk['choices'][0]['delta']
      print(delta)

    #   if 'role' in delta:
    #     print(delta['role'], end=': ')
    #   elif 'content' in delta:
    #     print(delta['content'], end='')


   return model_output


if __name__ == "__main__":


#    my_prompt = "Q: What is your name? A:"


   model_output = generate_text_from_prompt_v2()

#    print(model_output)

   #final_result = model_output["choices"][0]["text"].strip()

   #print(final_result)
