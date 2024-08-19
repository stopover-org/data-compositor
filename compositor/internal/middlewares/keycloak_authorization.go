package middlewares

import (
	"context"
	"fmt"
	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/labstack/echo/v4"
	"golang.org/x/exp/slices"
	"strings"
)

func OIDCAuthMiddleware(issuer, clientID string) echo.MiddlewareFunc {
	provider, err := oidc.NewProvider(context.Background(), issuer)
	if err != nil {
		panic(fmt.Sprintf("Failed to get provider: %v", err))
	}

	verifier := provider.Verifier(&oidc.Config{
		ClientID: clientID,
	})

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if c.Path() == "/playground" {
				return next(c)
			}

			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.ErrUnauthorized
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				return echo.ErrUnauthorized
			}

			rawToken := parts[1]
			idToken, err := verifier.Verify(context.Background(), rawToken)
			if err != nil {
				return echo.ErrUnauthorized
			}

			// Optionally, parse claims
			var claims map[string]interface{}
			if err := idToken.Claims(&claims); err != nil {
				return echo.ErrUnauthorized
			}

			groups, ok := claims["groups"].([]interface{})
			if !ok {
				return echo.ErrUnauthorized
			}

			if !slices.Contains(groups, "/analyst") {
				return echo.ErrUnauthorized
			}

			// Store the ID Token and Claims in the context for use in handlers
			c.Set("idToken", idToken)
			c.Set("claims", claims)

			return next(c)
		}
	}
}
