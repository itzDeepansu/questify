import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => {
      return !!token;
    },
  },
});

// Specify the matcher to protect specific routes
export const config = {
  matcher: ["/"],
};
