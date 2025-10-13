"use client";

import React, { useEffect, useState } from "react";

type Item = { id: string; name: string };

export default function ItemList() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/items")
      .then((r) => {
        if (!r.ok) throw new Error("Network response was not ok");
        return r.json();
      })
      .then((data) => {
        if (mounted) setItems(data);
      })
      .catch((err) => {
        if (mounted) setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading items…</div>;
  if (error) return <div role="alert">Error: {error}</div>;
  if (!items || items.length === 0) return <div>No items found.</div>;

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="p-2 border rounded">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
