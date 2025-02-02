from ollama import chat
from ollama import ChatResponse

# System message instructing the model's role and task
system_message = """\
You are a crime validation assistant. Your job is to analyze the user's crime report and the relevant news summaries below.\n
You must provide:\n
1) A numeric probability between 0 and 1 that the user’s report is true.\n
2) A short (1-2 sentence) explanation for your reasoning.\n
If the news summaries directly support the user’s report, give a higher probability.\n
If they contradict the user’s report or there are no matching details, give a lower probability.\n
Remember that not all incidents appear in mainstream news, so lack of coverage alone does not invalidate a claim.\n
"""

# Example user report
user_report = (
    "There was a robbery at a small convenience store in Downtown Riyadh at 10 PM on Jan 10."
)

# Example news summaries (you might generate or retrieve these from a database or API)
news_summaries = """\
1) Saudi Times (Jan 10, 11 PM): Police confirmed a robbery at a convenience store in downtown Riyadh.
2) Local blog (Jan 10, 10:30 PM): Eye-witness reported suspicious activity near a store in the downtown Riyadh.
"""

# Construct the messages list
messages = [
    {
        'role': 'system',
        'content': system_message
    },
    {
        'role': 'user',
        'content': f"User Report:\n{user_report}\n\nNews Summaries:\n{news_summaries}\n\n"
                   "Please provide a probability (0 to 1) that this user’s report is true, "
                   "then briefly explain your reasoning in third person."
    }
]

response: ChatResponse = chat(
    model='llama3.2', 
    messages=messages
    )

# Print the model's response
response = response.message.content

print(response)