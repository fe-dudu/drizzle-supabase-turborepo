'use client';

import { useEffect, useState } from 'react';

export function Test() {
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    (async () => {
      await fetch('/api/users')
        .then((resp) => resp.json())
        .then((resp) => setData(resp.data));
    })();
  }, []);

  return <>{JSON.stringify(data)}</>;
}
