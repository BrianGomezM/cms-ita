-- ============================================================
-- Row Level Security (RLS) para aislamiento multi-tenant
-- CMS ITA — Resolución MinTIC 1519
-- ============================================================

-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Variable de sesión para el tenant activo
-- Payload la setea antes de cada query via beforeOperation hook
ALTER DATABASE cms_ita SET app.current_tenant_id = '0';

-- ============================================================
-- FUNCIÓN: obtiene el tenant_id de la sesión actual
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_tenant_id', TRUE), '0')::INTEGER;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCIÓN: verifica si el usuario actual es superadmin
-- (los superadmins bypass el RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('app.is_superadmin', TRUE) = 'true';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- RLS en tabla pages
-- ============================================================
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Superadmin ve todo
CREATE POLICY pages_superadmin ON pages
  USING (is_superadmin() = TRUE);

-- Tenant solo ve sus páginas
CREATE POLICY pages_tenant ON pages
  USING (
    is_superadmin() = TRUE
    OR tenant_id = get_current_tenant_id()
    OR get_current_tenant_id() IS NULL  -- sin contexto: solo lectura pública
  );

-- ============================================================
-- RLS en tabla media
-- ============================================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY media_tenant ON media
  USING (
    is_superadmin() = TRUE
    OR tenant_id = get_current_tenant_id()
    OR tenant_id IS NULL  -- medios sin tenant son públicos
  );

-- ============================================================
-- RLS en tabla ita_checklist
-- ============================================================
ALTER TABLE ita_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY ita_tenant ON ita_checklist
  USING (
    is_superadmin() = TRUE
    OR tenant_id = get_current_tenant_id()
  );

-- ============================================================
-- RLS en tabla users (solo ve usuarios de su tenant)
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_tenant ON users
  USING (
    is_superadmin() = TRUE
    OR tenant_id = get_current_tenant_id()
    OR id = get_current_tenant_id()  -- puede verse a sí mismo
  );