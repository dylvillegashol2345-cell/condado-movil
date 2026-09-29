import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { enviarConsulta } from "../../services/consultas";
import { obtenerPropiedad } from "../../services/propiedades";
import { localidadLabel } from "../../utils/catalogos";
import { money } from "../../utils/format";

function validar({ nombre, telefono }) {
  const errores = {};
  if (nombre.trim().length < 2) {
    errores.nombre = "Ingresá tu nombre.";
  }
  const digitos = telefono.replace(/\D/g, "");
  const soloNumeros = /^[\d\s()+-]+$/.test(telefono.trim());
  if (!soloNumeros || digitos.length < 6 || digitos.length > 15) {
    errores.telefono = "Ingresá un teléfono válido: solo números, entre 6 y 15 dígitos.";
  }
  return errores;
}

export default function SolicitarVisita() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaPreferida, setFechaPreferida] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const { data: propiedad } = useQuery({
    queryKey: ["propiedad", id],
    queryFn: () => obtenerPropiedad(id),
  });

  const envio = useMutation({
    mutationFn: enviarConsulta,
    onSuccess: () => setEnviado(true),
  });

  const volver = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const enviar = () => {
    const nuevosErrores = validar({ nombre, telefono });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const direccion = propiedad
      ? `${propiedad.Barrio} · ${propiedad.Calle} ${propiedad.Numeracion}, ${localidadLabel(propiedad.IdLocalidad)}`
      : `Propiedad #${id}`;

    const cuerpo = [
      "Solicitud de visita desde la app móvil.",
      `Día y horario preferido: ${fechaPreferida.trim() || "a coordinar"}.`,
      mensaje.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    envio.mutate({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      mensaje: cuerpo,
      // en la base es NVARCHAR(200)
      propiedadInteres: `${direccion} (ID ${id})`.slice(0, 200),
    });
  };

  if (enviado) {
    return (
      <Pantalla edges={["top"]}>
        <Exito>
          <Ionicons name="checkmark-circle" size={64} color="#2e7d32" />
          <ExitoTitulo>Solicitud enviada</ExitoTitulo>
          <ExitoDetalle>
            Un agente de Grupo Condado se va a comunicar con vos al {telefono.trim()} para
            coordinar la visita.
          </ExitoDetalle>
          <Link href="/" asChild>
            <Boton activeOpacity={0.85}>
              <BotonTexto>Volver al catálogo</BotonTexto>
            </Boton>
          </Link>
        </Exito>
      </Pantalla>
    );
  }

  return (
    <Pantalla edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Barra>
            <Volver onPress={volver} activeOpacity={0.7} accessibilityLabel="Volver">
              <Ionicons name="arrow-back" size={22} color="#1a1209" />
            </Volver>
            <Titulo>Solicitar visita</Titulo>
          </Barra>

          {propiedad ? (
            <Resumen>
              <ResumenPrecio>{money(propiedad.Precio)}</ResumenPrecio>
              <ResumenDireccion>
                {propiedad.Barrio} · {propiedad.Calle} {propiedad.Numeracion}
              </ResumenDireccion>
              <ResumenLocalidad>{localidadLabel(propiedad.IdLocalidad)}</ResumenLocalidad>
            </Resumen>
          ) : null}

          <Formulario>
            <Campo>
              <Etiqueta>Nombre y apellido *</Etiqueta>
              <Entrada
                value={nombre}
                onChangeText={setNombre}
                placeholder="Como querés que te llamemos"
                placeholderTextColor="#a0918a"
                autoCapitalize="words"
                autoCorrect={false}
                conError={Boolean(errores.nombre)}
              />
              {errores.nombre ? <Error>{errores.nombre}</Error> : null}
            </Campo>

            <Campo>
              <Etiqueta>Teléfono *</Etiqueta>
              <Entrada
                value={telefono}
                onChangeText={setTelefono}
                placeholder="351 555 1234"
                placeholderTextColor="#a0918a"
                keyboardType="phone-pad"
                conError={Boolean(errores.telefono)}
              />
              {errores.telefono ? <Error>{errores.telefono}</Error> : null}
            </Campo>

            <Campo>
              <Etiqueta>Día y horario preferido</Etiqueta>
              <Entrada
                value={fechaPreferida}
                onChangeText={setFechaPreferida}
                placeholder="Ej: sábado a la mañana"
                placeholderTextColor="#a0918a"
              />
            </Campo>

            <Campo>
              <Etiqueta>Mensaje</Etiqueta>
              <Entrada
                value={mensaje}
                onChangeText={setMensaje}
                placeholder="Algo que quieras aclarar (opcional)"
                placeholderTextColor="#a0918a"
                multiline
                numberOfLines={4}
                maxLength={800}
                textAlignVertical="top"
                alta
              />
            </Campo>

            {envio.error ? (
              <ErrorEnvio>
                <Ionicons name="alert-circle-outline" size={16} color="#b71c1c" />
                <ErrorEnvioTexto>{envio.error.message}</ErrorEnvioTexto>
              </ErrorEnvio>
            ) : null}

            <Boton onPress={enviar} activeOpacity={0.85} disabled={envio.isPending}>
              <BotonTexto>{envio.isPending ? "Enviando…" : "Enviar solicitud"}</BotonTexto>
            </Boton>

            <Nota>
              La inmobiliaria recibe tu solicitud y un agente te contacta para coordinar
              día y horario.
            </Nota>
          </Formulario>
        </ScrollView>
      </KeyboardAvoidingView>
    </Pantalla>
  );
}

const Pantalla = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`;

const Barra = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 8px 6px 4px;
`;

const Volver = styled.TouchableOpacity`
  padding: 10px 12px;
`;

const Titulo = styled.Text`
  font-family: serif;
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.condado};
`;

const Resumen = styled.View`
  margin: 8px 16px 4px;
  padding: 14px 16px;
  background-color: ${({ theme }) => theme.colors.condadoLight};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const ResumenPrecio = styled.Text`
  font-family: serif;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.condado};
`;

const ResumenDireccion = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 2px;
`;

const ResumenLocalidad = styled.Text`
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const Formulario = styled.View`
  padding: 12px 16px 40px;
`;

const Campo = styled.View`
  margin-bottom: 16px;
`;

const Etiqueta = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const Entrada = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme, conError }) => (conError ? "#b71c1c" : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  padding: 12px 14px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textPrimary};
  min-height: ${({ alta }) => (alta ? "110px" : "auto")};
`;

const Error = styled.Text`
  font-size: 12px;
  color: #b71c1c;
  margin-top: 5px;
`;

const ErrorEnvio = styled.View`
  flex-direction: row;
  gap: 8px;
  background-color: #fdecea;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  margin-bottom: 14px;
`;

const ErrorEnvioTexto = styled.Text`
  flex: 1;
  font-size: 12.5px;
  color: #b71c1c;
  line-height: 18px;
`;

const Boton = styled.TouchableOpacity`
  background-color: ${({ theme, disabled }) => (disabled ? theme.colors.condado3 : theme.colors.condado)};
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  margin-top: 4px;
`;

const BotonTexto = styled.Text`
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
`;

const Nota = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-top: 14px;
  line-height: 18px;
`;

const Exito = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const ExitoTitulo = styled.Text`
  font-family: serif;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 16px;
`;

const ExitoDetalle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 21px;
  margin-top: 10px;
  margin-bottom: 28px;
`;
