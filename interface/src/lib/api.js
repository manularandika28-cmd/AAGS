// Medical Review Service Functions
export async function fetchMedicalSubmissions() {
  return request('/medicals');
}

export async function updateMedicalStatus(submissionId, status, reviewedBy = 'HOD') {
  return request(`/medicals/${submissionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reviewed_by: reviewedBy }),
  });
}
// Meetings Service Functions
export async function fetchMeetingRequests() {
  return request('/meetings');
}

export async function updateMeetingStatus(requestId, status) {
  return request(`/meetings/${requestId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export { API_BASE_URL, request };