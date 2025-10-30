function safeSearch(userInput: string) {
  const sanitized = encodeURIComponent(String(userInput));
  const url = `/search?q=${sanitized}`;
  console.log("Safe URL built:", url);
  return url;
}

safeSearch("<img src=x onerror=alert(1)>");
