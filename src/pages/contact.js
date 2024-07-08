import {
  Box,
  Button,
  ComboBox,
  Fieldset,
  Heading,
  Module,
  SelectList,
  Spinner,
  Text,
  TextArea,
  TextField,
} from "gestalt";
import React, { useContext } from "react";
import { useState } from "react";
import { BASE_URL } from "../defaults";
import { notifyError, notifySuccess } from "../utils/notify";
import Head from "next/head";
import Link from "next/link";
import { SiteConfigsContext } from "../context/siteConfigsContext";

export default function Contact({
  faqGroups = [],
  fetchedSubjectChoices = [],
}) {
  const subjectBaseChoices = [
    "Demande d'informations sur un produit",
    "Problème technique avec le site",
    "Retours et remboursements",
    "Suivi de commande",
    "Demande de devis pour une commande en gros",
    "Signalement d'un produit défectueux",
    "Question concernant les options de livraison",
    "Proposition de collaboration commerciale",
    "Suggestion pour améliorer le site",
    "Plainte concernant une expérience d'achat négative",
    "Demande d'annulation de commande",
  ];
  let subjectChoices = fetchedSubjectChoices?.length
    ? fetchedSubjectChoices
    : subjectBaseChoices;
  const [selectedSubject, setSelectedSubject] = useState(subjectChoices[0]);
  const [otherSubject, setOtherSubject] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState(null);

  const { siteConfigs } = useContext(SiteConfigsContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSending(true);
    const fd = new FormData();
    fd.append("full_name", fullName);
    fd.append(
      "purpose",
      selectedSubject?.toLowerCase() === "autre"
        ? otherSubject
        : selectedSubject
    );
    fd.append("email", email);
    fd.append("message", message);

    const res = await fetch(`${BASE_URL}/api/core/messages/`, {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      setFullName("");
      setEmail("");
      setOtherSubject("");
      setMessage("");
      notifySuccess("Votre message a été envoyé avec succès!");
    } else {
      let _errors = await res.json();
      setErrors(_errors);
      notifyError("Impossible d'envoyer ce message");
    }
    setSending(false);
  };
  return (
    <>
      <Head>
        <title>Webchrono | Contactez-nous</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box
        paddingX={3}
        smPaddingX={6}
        mdPaddingX={12}
        marginTop={7}
        marginBottom={12}
      >
        <Heading size="600">Obtenez de l'aide</Heading>
        <div className="flex flex-col-reverse md:flex-row md:justify-between gap-16 mt-8">
          <div className="flex-1 md:max-h-[600px] md:overflow-y-auto">
            <Box marginTop={5}>
              <Heading size="400">Questions fréquentes</Heading>
              <ul className="mt-4 flex flex-col gap-7">
                {faqGroups
                  ?.sort((a, b) => a?.name?.localeCompare(b?.name))
                  ?.map((faqGroup) => (
                    <li key={faqGroup?.id}>
                      <Fieldset legend={faqGroup?.name}>
                        <Module.Expandable
                          id={`faq-module-${faqGroup?.name}`}
                          title={faqGroup?.name}
                          type="info"
                          items={faqGroup?.faqquestion_set
                            ?.sort((a, b) => a?.order - b?.order)
                            ?.map((faqquestion) => ({
                              children: (
                                <Text size="200">{faqquestion?.response}</Text>
                              ),
                              title: faqquestion?.question,
                            }))}
                        />
                      </Fieldset>
                    </li>
                  ))}
              </ul>
            </Box>
          </div>
          <div className="md:flex-[1.5] lg:flex-1 flex flex-col">
            {siteConfigs?.whatsapp_link && (
              <Box marginTop={5}>
                <Heading size="400">Contacts</Heading>
                <Link
                  href={siteConfigs?.whatsapp_link}
                  target="blank"
                  className="block mt-4"
                >
                  <Button
                    text="WhatsApp"
                    fullWidth
                    color="gray"
                    iconEnd="whats-app"
                  />
                </Link>
              </Box>
            )}
            <Box marginTop={5}>
              <Heading size="400">Envoyez un message</Heading>
              <form
                className="mt-4 flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Nom complet *"
                  value={fullName}
                  onChange={(e) => setFullName(e.value)}
                  errorMessage={errors?.full_name}
                />
                <TextField
                  label="Email *"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.value)}
                  errorMessage={errors?.email}
                />
                <SelectList
                  id="subject"
                  label="Objet *"
                  onChange={({ value }) => setSelectedSubject(value)}
                  errorMessage={
                    selectedSubject?.toLowerCase() !== "autre"
                      ? errors?.purpose
                      : null
                  }
                >
                  {subjectChoices
                    ?.sort((a, b) => a.localeCompare(b))
                    ?.map((subject) => (
                      <SelectList.Option
                        key={subject}
                        label={subject}
                        value={subject}
                      />
                    ))}
                  <SelectList.Option label="Autre" value="Autre" />
                </SelectList>
                {selectedSubject?.toLowerCase() === "autre" && (
                  <TextField
                    label="Saisir l'objet du message *"
                    value={otherSubject}
                    onChange={({ value }) => setOtherSubject(value)}
                    errorMessage={
                      selectedSubject?.toLowerCase() === "autre"
                        ? errors?.purpose
                        : null
                    }
                  />
                )}
                <TextArea
                  placeholder="Décrivez votre problème"
                  label="Message *"
                  value={message}
                  onChange={({ value }) => setMessage(value)}
                  errorMessage={errors?.message}
                />
                {sending ? (
                  <Spinner show />
                ) : (
                  <div className="flex-1 flex justify-end">
                    <Button
                      color="red"
                      text="Envoyer le message"
                      type="submit"
                    />
                  </div>
                )}
              </form>
            </Box>
          </div>
        </div>
      </Box>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  let data = {
    faqGroups: [],
    fetchedSubjectChoices: [],
  };

  try {
    const res = await Promise.all([
      fetch(`${BASE_URL}/api/core/faq-groups`).then((res) => res.json()),
      fetch(`${BASE_URL}/api/core/configs`).then((res) => res.json()),
    ]);
    data.faqGroups = res?.length ? res[0] : [];
    data.fetchedSubjectChoices =
      res?.length > 1 && res[1]?.length
        ? res[1][0]?.contact_form_purpose_choices?.split(",")
        : [];
  } catch (error) {
    console.log(error);
  }

  return {
    props: data,
  };
};
