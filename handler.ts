const { v4: uuidv4 } = require('uuid');

const ALLOWED_TYPES = ['Pyme', 'Corporate'];

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, type } = body;

    if (!name || typeof name !== 'string') {
      return buildResponse(400, { error: 'Invalid name' });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return buildResponse(400, {
        error: 'Invalid type. Must be Pyme or Corporate',
      });
    }

    const newCompany = {
      id: uuidv4(),
      name,
      type,
      joinedAt: new Date().toISOString(),
    };

    console.log('Company saved:', newCompany);

    return buildResponse(201, {
      message: 'Company registered',
      company: newCompany,
    });
  } catch (err) {
    console.error('Error:', err);
    return buildResponse(500, { error: 'Internal Server Error' });
  }
};

const buildResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
};

/* 
Input esperado:
{
  "name": "Example Company Name",
  "type": "Pyme" | "Corporate"
}

Output
✅ 201 Created (si es válido)

{
    "message": "Company registered",
    "company": {
        "id": "9e64f4a1-3d52-4e49-b8f9-b25a6a38fc60",
        "name": "Acme S.A.",
        "type": "Pyme",
        "joinedAt": "2025-06-11T12:34:56.789Z"
    }
}
*/
