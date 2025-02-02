import feedparser

# Al Jazeera RSS feed URL
rss_url = "https://www.aljazeera.com/xml/rss/all.xml"

# Parse the RSS feed
feed = feedparser.parse(rss_url)

# Print feed details
print(f"Feed Title: {feed.feed.title}")
print(f"Feed Link: {feed.feed.link}")
print(f"Feed Description: {feed.feed.description}")

# Display the latest articles
for entry in feed.entries:  # Fetch the latest 5 articles
    print("\nTitle:", entry.title)
    print("Link:", entry.link)
    print("Published:", entry.published)
    print("Summary:", entry.summary)
