import { http, HttpResponse } from 'msw';
import companies from './data/companies.json';
import reports from './data/reports.json';

// Define types for request bodies
interface UserRequestBody {
  name: string;
  email: string;
}

interface RegistrationRequestBody {
  email: string;
}

interface VerifyPinRequestBody {
  email: string;
  pin: string;
}

interface BondRequestBody {
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  terms: string;
  policyholderId: string;
  beneficiaryId: string;
}

interface OfferRequestBody {
  bondAmount: string;
  premium: string;
  terms: string;
  effectiveDate: string;
  expiryDate: string;
  proposalId: string;
}

interface OTPRequestBody {
  otp: string;
}

interface PolicyholderRequestBody {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

interface ProposalRequestBody {
  title: string;
  description: string;
  brokerId: string;
  policyholderId: string;
}

interface MockOffer {
  id: string;
  proposalId: string;
  bondAmount: string;
  premium: string;
  effectiveDate: string;
  expiryDate: string;
  terms: string;
  status: string;
  createdAt: string;
}

interface MockBroker {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
}

interface MockPolicyholder {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
}

interface MockProposal {
  id: string;
  title: string;
  description: string;
  brokerId: string;
  policyholderId: string;
  status: string;
}

export const handlers = [
  // Keycloak authentication handlers
  http.get(
    'https://keycloak.example.com/realms/thinkbonds/protocol/openid-connect/auth',
    async ({ request }) => {
      const url = new URL(request.url);
      const redirectUri = url.searchParams.get('redirect_uri');

      // Add delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return a simple HTML page that simulates Keycloak login
      return HttpResponse.html(`
      <html>
        <head><title>Keycloak Login</title></head>
        <body>
          <h1>Mock Keycloak Login</h1>
          <form id="kc-form-login" action="${redirectUri}" method="post">
            <input type="hidden" name="code" value="mock-auth-code">
            <input type="hidden" name="state" value="${url.searchParams.get('state')}">
            <input type="hidden" name="session_state" value="mock-session-state">
          </form>
          <script>document.getElementById('kc-form-login').submit();</script>
        </body>
      </html>
    `);
    }
  ),

  http.post(
    'https://keycloak.example.com/realms/thinkbonds/protocol/openid-connect/token',
    async () => {
      // Add delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));

      // Return mock tokens
      return HttpResponse.json({
        access_token: 'mock-access-token',
        id_token: 'mock-id-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'openid email profile',
      });
    }
  ),

  http.get(
    'https://keycloak.example.com/realms/thinkbonds/protocol/openid-connect/userinfo',
    async () => {
      // Add delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 200));

      // Return mock user info
      return HttpResponse.json({
        sub: '1',
        name: 'Test User',
        email: 'test@example.com',
        preferred_username: 'testuser',
        groups: ['admin'],
      });
    }
  ),

  // Authentication handlers
  http.post('/api/auth/signin', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      url: 'http://localhost:3000/api/auth/callback/keycloak',
    });
  }),

  http.get('/api/auth/session', async ({ request }) => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 200));

    // Extract the JWT token from the cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionTokenMatch = cookieHeader.match(
      /next-auth\.session-token=([^;]+)/
    );
    const roleCookieMatch = cookieHeader.match(/e2e-role=([^;]+)/);

    if (sessionTokenMatch && sessionTokenMatch[1]) {
      try {
        // For NextAuth v4, the token is a JWE (JSON Web Encryption) with 5 parts
        const tokenParts = sessionTokenMatch[1].split('.');
        console.log('Session endpoint - Token parts count:', tokenParts.length);

        // Since we can't easily decode JWE without the private key, we'll extract the role from the test context
        // For testing purposes, we'll check if there's a role indicator in the token or use a default
        let userRole = roleCookieMatch?.[1] || 'admin';

        // Try to extract role information from the token if possible
        if (tokenParts.length === 5) {
          // This is a JWE token (NextAuth v4)
          // We can't decode it easily, so we'll use a heuristic to determine the role
          // In a real test scenario, we would have set the role in a test-specific way
          console.log('Session endpoint - Detected JWE token (NextAuth v4)');

          // For e2e tests, we'll check the test context or use a default
          // This is a simplified approach - in a real scenario, you might want to use a more sophisticated method
          // Prefer explicit role cookie set by tests
          if (!roleCookieMatch) {
            if (sessionTokenMatch[1].includes('broker')) userRole = 'broker';
            else if (sessionTokenMatch[1].includes('policyholder'))
              userRole = 'policyholder';
          }
        } else if (tokenParts.length === 3) {
          // This is a regular JWT token
          const tokenData = JSON.parse(
            Buffer.from(tokenParts[1], 'base64').toString()
          );
          userRole =
            roleCookieMatch?.[1] ||
            tokenData.user?.groups?.[0] ||
            tokenData.dominoData?.groups?.[0] ||
            'admin';
          console.log(
            'Session endpoint - Decoded JWT token:',
            JSON.stringify(tokenData, null, 2)
          );
        }

        console.log('Session endpoint - User role:', userRole);

        return HttpResponse.json({
          user: {
            id: '1',
            name: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} User`,
            email: `${userRole}@example.com`,
            image: undefined,
            groups: [userRole],
            dominoData: {
              id: 'domino-1',
              name: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} User`,
              email: `${userRole}@example.com`,
              groups: [userRole],
            },
          },
          accessToken: 'mock-access-token',
          expires: new Date(Date.now() + 3600 * 1000).toISOString(),
        });
      } catch (error) {
        // If there's an error decoding the token, return default admin session
        console.error('Error decoding JWT token:', error);
        console.error('Token value:', sessionTokenMatch[1]);
      }
    } else {
      console.log('No session token found in cookies:', cookieHeader);
    }

    // Default to admin session if no token is found or if there's an error
    return HttpResponse.json({
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        image: undefined,
        groups: ['admin'],
        dominoData: {
          id: 'domino-1',
          name: 'Admin User',
          email: 'admin@example.com',
          groups: ['admin'],
        },
      },
      accessToken: 'mock-access-token',
      expires: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  }),

  http.get('/api/me', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 200));

    return HttpResponse.json({
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      groups: ['admin'],
      dominoData: {
        id: 'domino-1',
        name: 'Admin User',
        email: 'admin@example.com',
        groups: ['admin'],
      },
    });
  }),
  http.get('/api/users', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ]);
  }),

  http.post('/api/users', async ({ request }) => {
    const newUser = (await request.json()) as UserRequestBody;
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    return HttpResponse.json({ id: 4, ...newUser }, { status: 201 });
  }),

  // Registration API handlers
  http.post('/api/registration/access-code', async ({ request }) => {
    const body = (await request.json()) as RegistrationRequestBody;
    const pin6 = Math.floor(100000 + Math.random() * 900000).toString();

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      email: body.email,
      pin6,
      link: `http://localhost:3000/broker/register?email=${encodeURIComponent(body.email)}`,
    });
  }),

  http.post('/api/registration/verify-pin', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // In a real mock, we would validate the PIN
    // For simplicity, we'll just return success
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/registration/submit', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      success: true,
      message: 'Registration submitted successfully',
    });
  }),

  // Creditsafe search handler
  http.get('/api/creditsafe/search', async ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    // Validate query parameter
    if (!query || query.length < 2) {
      return HttpResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Filter companies based on the search query
    const filteredCompanies = companies.filter(
      company =>
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.number.includes(query)
    );

    // Limit to 10 results
    const results = filteredCompanies.slice(0, 10);

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json(results);
  }),

  // Creditsafe reports handler
  http.get('/api/creditsafe/reports/:id', async ({ params }) => {
    const companyId = params.id as string;

    // Find the report for the company
    const report = reports.find(r => r.companyId === companyId);

    if (!report) {
      return HttpResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 400));

    return HttpResponse.json(report);
  }),

  // Bonds API handlers
  http.post('/api/bonds', async ({ request }) => {
    const body = (await request.json()) as BondRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: 'Bond PDF generated successfully',
      bondId: `BOND-${Date.now()}`,
      url: '/mock-bond.pdf',
      data: {
        ...body,
        id: `BOND-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/bonds/:id', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      id,
      bondAmount: '1000.00',
      premium: '50.00',
      effectiveDate: '2025-09-01',
      expiryDate: '2026-09-01',
      policyholder: {
        companyName: 'Tech Solutions Inc.',
        contactName: 'John Smith',
        email: 'john@techsolutions.com',
      },
      beneficiary: {
        companyName: 'Global Manufacturing Co.',
        contactName: 'Jane Doe',
        email: 'jane@globalmanufacturing.com',
      },
      terms:
        'This bond is issued subject to the terms and conditions outlined in the agreement.',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
  }),

  // Bond history handler
  http.get('/api/bonds/:id/history', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock edit history data
    const mockEditHistory = [
      {
        id: '1',
        timestamp: '2025-08-28T10:00:00Z',
        userId: 'wholesaler1',
        userName: 'Wholesaler User',
        action: 'Created',
        changes: {},
      },
    ];

    return HttpResponse.json(mockEditHistory);
  }),

  // Bond soft delete handler
  http.delete('/api/bonds/:id', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Bond ${id} soft deleted successfully`,
      data: {
        id,
        status: 'soft_deleted',
      },
    });
  }),

  // Bond restore handler
  http.put('/api/bonds/:id/restore', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Bond ${id} restored successfully`,
      data: {
        id,
        status: 'active',
      },
    });
  }),

  // Offer restore handler
  http.put('/api/offers/:id/restore', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Offer ${id} restored successfully`,
      data: {
        id,
        status: 'pending',
      },
    });
  }),

  // Bond generation handler
  http.post('/api/bonds/:id/generate', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as OTPRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: 'Bond PDF generated successfully',
      bondId: id,
      url: '/mock-bond.pdf',
      data: {
        ...body,
        id,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Bond acceptance handler
  http.post('/api/bonds/:id/accept', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as OTPRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // In development, validate with the hardcoded code "123456"
    if (process.env.NODE_ENV === 'development' && body.otp === '123456') {
      return HttpResponse.json({
        message: 'Bond accepted successfully',
        bondId: id,
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
      });
    }

    // For other cases, just return success
    return HttpResponse.json({
      message: 'Bond accepted successfully',
      bondId: id,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });
  }),

  // Bond rejection handler
  http.post('/api/bonds/:id/reject', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: 'Bond rejected successfully',
      bondId: id,
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
    });
  }),

  // Bond OTP validation handler
  http.post('/api/bonds/:id/validate-otp', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as OTPRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // In development, validate with the hardcoded code "123456"
    if (process.env.NODE_ENV === 'development' && body.otp === '123456') {
      // Fetch offer details
      const offer: MockOffer = {
        id: id,
        proposalId: '1',
        bondAmount: '1000.00',
        premium: '50.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms: 'Standard terms and conditions apply',
        status: 'pending',
        createdAt: '2025-08-28T10:00:00Z',
      };

      const policyholder: MockPolicyholder = {
        id: '1',
        companyName: 'Tech Solutions Inc.',
        contactName: 'John Smith',
        email: 'john@techsolutions.com',
        phone: '+44 1234 567890',
        status: 'approved',
      };

      const beneficiary: MockPolicyholder = {
        id: '2',
        companyName: 'Global Manufacturing Co.',
        contactName: 'Jane Doe',
        email: 'jane@globalmanufacturing.com',
        phone: '+44 9876 543210',
        status: 'approved',
      };

      return HttpResponse.json({
        offer,
        policyholder,
        beneficiary,
      });
    }

    // For other cases, return error
    return HttpResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }),

  // Offers API handlers
  http.get('/api/offers', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock offers data
    const mockOffers = [
      {
        id: '1',
        proposalId: '1',
        bondAmount: '1000.00',
        premium: '50.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms: 'Standard terms and conditions apply',
        status: 'pending',
        createdAt: '2025-08-28T10:00:00Z',
      },
      {
        id: '2',
        proposalId: '2',
        bondAmount: '2000.00',
        premium: '100.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms: 'Standard terms and conditions apply',
        status: 'accepted',
        createdAt: '2025-08-27T10:00:00Z',
      },
    ];

    return HttpResponse.json(mockOffers);
  }),

  // Offers bin handler
  http.get('/api/offers/bin', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock soft deleted offers data
    const mockOffers = [
      {
        id: '3',
        proposalId: '3',
        bondAmount: '1500.00',
        premium: '75.00',
        effectiveDate: '2025-09-01',
        expiryDate: '2026-09-01',
        terms: 'Standard terms and conditions apply',
        status: 'soft_deleted',
        createdAt: '2025-08-26T10:00Z',
        editHistory: [
          {
            id: '4',
            timestamp: '2025-08-26T10:00:00Z',
            userId: 'wholesaler1',
            userName: 'Wholesaler User',
            action: 'Created',
            changes: {},
          },
          {
            id: '5',
            timestamp: '2025-08-27T10:00Z',
            userId: 'wholesaler1',
            userName: 'Wholesaler User',
            action: 'Soft deleted',
            changes: {
              status: 'soft_deleted',
            },
          },
        ],
      },
    ];

    const softDeletedOffers = mockOffers.filter(
      (offer: MockOffer) => offer.status === 'soft_deleted'
    );

    return HttpResponse.json(softDeletedOffers);
  }),

  // Offer history handler
  http.get('/api/offers/:id/history', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock edit history data
    const mockEditHistory = [
      {
        id: '1',
        timestamp: '2025-08-28T10:00:00Z',
        userId: 'wholesaler1',
        userName: 'Wholesaler User',
        action: 'Created',
        changes: {},
      },
    ];

    return HttpResponse.json(mockEditHistory);
  }),

  // Brokers handlers
  http.get('/api/brokers/bin', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock soft deleted brokers data
    const mockBrokers = [
      {
        id: '3',
        companyName: 'Deleted Broker',
        contactName: 'Deleted User',
        email: 'deleted@example.com',
        phone: '+111111',
        status: 'soft_deleted',
        editHistory: [
          {
            id: '4',
            timestamp: '2025-08-26T09:45:00Z',
            userId: 'admin1',
            userName: 'Admin User',
            action: 'Created',
            changes: {},
          },
          {
            id: '5',
            timestamp: '2025-08-27T09:45:00Z',
            userId: 'admin1',
            userName: 'Admin User',
            action: 'Soft deleted',
            changes: {
              status: 'soft_deleted',
            },
          },
        ],
      },
    ];

    const softDeletedBrokers = mockBrokers.filter(
      (broker: MockBroker) => broker.status === 'soft_deleted'
    );

    return HttpResponse.json(softDeletedBrokers);
  }),

  http.get('/api/brokers/:id/history', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock edit history data
    const mockEditHistory = [
      {
        id: '1',
        timestamp: '2025-08-28T10:00:00Z',
        userId: 'admin1',
        userName: 'Admin User',
        action: 'Created',
        changes: {},
      },
    ];

    return HttpResponse.json(mockEditHistory);
  }),

  http.put('/api/brokers/:id/restore', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Broker ${id} restored successfully`,
      data: {
        id,
        status: 'pending',
      },
    });
  }),

  // Policyholders handlers
  http.get('/api/policyholders/bin', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock soft deleted policyholders data
    const mockPolicyholders = [
      {
        id: '3',
        companyName: 'Deleted Policyholder',
        contactName: 'Deleted User',
        email: 'deleted_policyholder@example.com',
        phone: '+33333',
        status: 'soft_deleted',
        editHistory: [
          {
            id: '4',
            timestamp: '2025-08-26T09:45:00Z',
            userId: 'admin1',
            userName: 'Admin User',
            action: 'Created',
            changes: {},
          },
          {
            id: '5',
            timestamp: '2025-08-27T09:45:00Z',
            userId: 'admin1',
            userName: 'Admin User',
            action: 'Soft deleted',
            changes: {
              status: 'soft_deleted',
            },
          },
        ],
      },
    ];

    const softDeletedPolicyholders = mockPolicyholders.filter(
      (policyholder: MockPolicyholder) => policyholder.status === 'soft_deleted'
    );

    return HttpResponse.json(softDeletedPolicyholders);
  }),

  http.get('/api/policyholders/:id/history', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock edit history data
    const mockEditHistory = [
      {
        id: '1',
        timestamp: '2025-08-28T10:00:00Z',
        userId: 'admin1',
        userName: 'Admin User',
        action: 'Created',
        changes: {},
      },
    ];

    return HttpResponse.json(mockEditHistory);
  }),

  http.put('/api/policyholders/:id/restore', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Policyholder ${id} restored successfully`,
      data: {
        id,
        status: 'pending',
      },
    });
  }),

  // Policyholders API handlers
  http.get('/api/policyholders', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock policyholders data
    const mockPolicyholders = [
      {
        id: '1',
        companyName: 'Tech Solutions Inc.',
        contactName: 'John Smith',
        email: 'john@techsolutions.com',
        phone: '+44 1234 567890',
        status: 'approved',
        createdAt: '2025-08-28T10:00:00Z',
      },
      {
        id: '2',
        companyName: 'Global Manufacturing Co.',
        contactName: 'Jane Doe',
        email: 'jane@globalmanufacturing.com',
        phone: '+44 9876 543210',
        status: 'pending',
        createdAt: '2025-08-27T10:00:00Z',
      },
    ];

    return HttpResponse.json(mockPolicyholders);
  }),

  http.post('/api/policyholders', async ({ request }) => {
    const body = (await request.json()) as PolicyholderRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: 'Policyholder created successfully',
      data: {
        ...body,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/policyholders/:id', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      id,
      companyName: 'Tech Solutions Inc.',
      contactName: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+44 1234 567890',
      status: 'approved',
      createdAt: '2025-08-28T10:00:00Z',
    });
  }),

  http.put('/api/policyholders/:id', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as ProposalRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Policyholder ${id} updated successfully`,
      data: {
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.put('/api/policyholders/:id/approve', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Policyholder ${id} approved successfully`,
      data: {
        id,
        status: 'approved',
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.put('/api/policyholders/:id/decline', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Policyholder ${id} declined successfully`,
      data: {
        id,
        status: 'declined',
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Proposals API handlers
  http.get('/api/proposals', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock proposals data
    const mockProposals = [
      {
        id: '1',
        title: 'Proposal for Tech Solutions',
        description: 'Bond proposal for Tech Solutions Inc.',
        brokerId: '1',
        policyholderId: '1',
        bondAmount: '1000.00',
        premium: '50.00',
        status: 'draft',
        createdAt: '2025-08-28T10:00:00Z',
      },
      {
        id: '2',
        title: 'Proposal for Global Manufacturing',
        description: 'Bond proposal for Global Manufacturing Co.',
        brokerId: '1',
        policyholderId: '2',
        bondAmount: '2000.00',
        premium: '100.00',
        status: 'pending',
        createdAt: '2025-08-27T10:00:00Z',
      },
    ];

    return HttpResponse.json(mockProposals);
  }),

  http.post('/api/proposals', async ({ request }) => {
    const body = (await request.json()) as OfferRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: 'Proposal created successfully',
      data: {
        ...body,
        id: Date.now().toString(),
        status: 'draft',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.get('/api/proposals/:id', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      id,
      title: 'Proposal for Tech Solutions',
      description: 'Bond proposal for Tech Solutions Inc.',
      brokerId: '1',
      policyholderId: '1',
      bondAmount: '1000.00',
      premium: '50.00',
      status: 'draft',
      createdAt: '2025-08-28T10:00:00Z',
    });
  }),

  http.put('/api/proposals/:id', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as ProposalRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Proposal ${id} updated successfully`,
      data: {
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete('/api/proposals/:id', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Proposal ${id} soft deleted successfully`,
      data: {
        id,
        status: 'soft_deleted',
      },
    });
  }),

  http.post('/api/proposals/:id/offer', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as OfferRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: 'Offer created successfully',
      data: {
        ...body,
        id: Date.now().toString(),
        proposalId: id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // Proposals handlers
  http.get('/api/proposals/bin', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock soft deleted proposals data
    const mockProposals = [
      {
        id: '3',
        title: 'Deleted Proposal',
        description: 'This proposal has been deleted',
        brokerId: '1',
        policyholderId: '2',
        status: 'soft_deleted',
        editHistory: [
          {
            id: '5',
            timestamp: '2025-08-26T09:45:00Z',
            userId: 'broker1',
            userName: 'Broker User',
            action: 'Created',
            changes: {},
          },
          {
            id: '6',
            timestamp: '2025-08-27T09:45:00Z',
            userId: 'broker1',
            userName: 'Broker User',
            action: 'Soft deleted',
            changes: {
              status: 'soft_deleted',
            },
          },
        ],
      },
    ];

    const softDeletedProposals = mockProposals.filter(
      (proposal: MockProposal) => proposal.status === 'soft_deleted'
    );

    return HttpResponse.json(softDeletedProposals);
  }),

  http.get('/api/proposals/:id/history', async () => {
    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return mock edit history data
    const mockEditHistory = [
      {
        id: '1',
        timestamp: '2025-08-28T10:00:00Z',
        userId: 'broker1',
        userName: 'Broker User',
        action: 'Created',
        changes: {},
      },
    ];

    return HttpResponse.json(mockEditHistory);
  }),

  http.put('/api/proposals/:id/restore', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Proposal ${id} restored successfully`,
      data: {
        id,
        status: 'draft',
      },
    });
  }),

  http.post('/api/offers', async ({ request }) => {
    const body = (await request.json()) as OfferRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    return HttpResponse.json({
      message: 'Offer created successfully',
      data: {
        ...body,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  }),

  http.put('/api/offers/:id', async ({ params, request }) => {
    const id = params.id as string;
    const body = (await request.json()) as OfferRequestBody;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Offer ${id} updated successfully`,
      data: {
        ...body,
        id,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  http.delete('/api/offers/:id', async ({ params }) => {
    const id = params.id as string;

    // Add delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));

    return HttpResponse.json({
      message: `Offer ${id} deleted successfully`,
    });
  }),
];
