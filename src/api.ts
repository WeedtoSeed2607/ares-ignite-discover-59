// In src/api.ts

export async function createTask(taskDescription: string) {
  const url = 'https://ares-31931.bubbleapps.io/version-test/api/1.1/obj/task';
  const apiKey = 'YOUR_NEW_SECURE_API_KEY'; // Use your new, secure key

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'description': taskDescription
    })
  });

  if (response.ok) {
    console.log('Task created successfully!');
    const result = await response.json();
    return result;
  } else {
    console.error('Failed to create task.');
  }
}
