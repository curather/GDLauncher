/* eslint-disable react/no-unescaped-entities */
import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faStar, faWrench } from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';
import Modal from '../../components/Modal';
import SocialButtons from '../../components/SocialButtons';
import ga from '../../utils/analytics';
import changelog from './changeLog';

const UpdateRow = ({ header, content, advanced }) => {
  const prSplit = advanced?.pr?.split('/');
  return (
    <li>
      &bull; {header}{' '}
      <span
        css={`
          color: ${props => props.theme.palette.text.third};
        `}
      >
        {content}
      </span>
      {advanced && (
        <>
          <div
            css={`
              color: ${props => props.theme.palette.text.third};
              font-size: 12px;
              a {
                color: ${props => props.theme.palette.primary.light};
              }
              a:hover {
                color: ${props => props.theme.palette.primary.main};
              }
            `}
          >
            <a
              href={`https://github.com/gorilla-devs/GDLauncher/commit/${advanced.cm}`}
            >
              {advanced.cm}
            </a>
            {prSplit && (
              <>
                {' | '}
                {/* Yes, this was the best (and shortest) version to do this I could come up with */}
                <a
                  href={`https://github.com/gorilla-devs/GDLauncher/pull/${
                    prSplit[0]
                  }${prSplit.length > 1 ? `/commits/${prSplit[1]}` : ''}`}
                >
                  #{advanced.pr}
                </a>
              </>
            )}
            {advanced.ms && <> | {advanced.ms}</>}
          </div>
        </>
      )}
    </li>
  );
};

const ChangeLogs = () => {
  const [version, setVersion] = useState(null);
  const [skipIObserver, setSkipIObserver] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { ref: intersectionObserverRef, inView: insectionObserverInView } =
    useInView({
      threshold: 0.3,
      initialInView: false,
      triggerOnce: true,
      skip: skipIObserver
    });

  useEffect(() => {
    ipcRenderer
      .invoke('getAppVersion')
      .then(v => {
        setVersion(v);
        if (!v.includes('beta')) {
          setTimeout(() => {
            setSkipIObserver(false);
          }, 300);
        }
        return v;
      })
      .catch(console.error);
    ga.sendCustomEvent('changelogModalOpen');
  }, []);

  useEffect(() => {
    if (insectionObserverInView) {
      ga.sendCustomEvent('changelogModalReadAll');
    }
  }, [insectionObserverInView]);

  return (
    <Modal
      css={`
        height: 550px;
        width: 475px;
      `}
      title={`What's new in ${version}`}
      removePadding
    >
      <Container>
        <Header>
          <a
            css={`
              margin-top: 20px;
              color: ${props => props.theme.palette.primary.light};
            `}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced
              ? 'Hide extended information'
              : 'Show extended information'}
          </a>
        </Header>
        <Section>
          {changelog.new.length ? (
            <SectionTitle
              css={`
                color: ${props => props.theme.palette.colors.green};
              `}
            >
              <span
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <FontAwesomeIcon
                  icon={faStar}
                  css={`
                    margin-right: 10px;
                    font-size: 20px;
                  `}
                />
                New
              </span>
            </SectionTitle>
          ) : null}
          <ul>
            {changelog.new.map((item, index) => (
              <UpdateRow
                /* eslint-disable-next-line react/no-array-index-key */
                key={index}
                header={item.header}
                content={item.content}
                advanced={showAdvanced && item.advanced}
              />
            ))}
          </ul>
        </Section>
        <Section>
          {changelog.improvements.length ? (
            <SectionTitle
              css={`
                color: ${props => props.theme.palette.colors.yellow};
              `}
            >
              <span
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <FontAwesomeIcon
                  icon={faWrench}
                  css={`
                    margin-right: 10px;
                    font-size: 20px;
                  `}
                />
                Improved
              </span>
            </SectionTitle>
          ) : null}
          <ul>
            {changelog.improvements.map((item, index) => (
              <UpdateRow
                /* eslint-disable-next-line react/no-array-index-key */
                key={index}
                header={item.header}
                content={item.content}
                advanced={showAdvanced && item.advanced}
              />
            ))}
          </ul>
        </Section>
        <Section>
          {changelog.bugfixes.length ? (
            <SectionTitle
              css={`
                color: ${props => props.theme.palette.colors.red};
              `}
            >
              <span
                css={`
                  display: flex;
                  align-items: center;
                `}
              >
                <FontAwesomeIcon
                  icon={faBug}
                  css={`
                    margin-right: 10px;
                    font-size: 20px;
                  `}
                />
                Bug Fixes
              </span>
            </SectionTitle>
          ) : null}
          <ul ref={intersectionObserverRef}>
            {changelog.bugfixes.map((item, index) => (
              <UpdateRow
                /* eslint-disable-next-line react/no-array-index-key */
                key={index}
                header={item.header}
                content={item.content}
                advanced={showAdvanced && item.advanced}
              />
            ))}
          </ul>
        </Section>
      </Container>
      <div
        css={`
          position: sticky;
          bottom: 0;
          height: 60px;
          width: 100%;
          background: ${props => props.theme.palette.grey[800]};
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 0 20px;
        `}
      >
        <SocialButtons />
        <span
          css={`
            padding-left: 20px;
            color: ${props => props.theme.palette.text.secondary};
          `}
        >
          Follow us for more updates
        </span>
      </div>
    </Modal>
  );
};

export default memo(ChangeLogs);

const Container = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
  color: ${props => props.theme.palette.text.primary};
  padding: 20px;
`;

const SectionTitle = styled.h2`
  width: 100%;
  margin: 0;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 22px;
`;

const Section = styled.div`
  width: 100%;
  font-size: 16px;
  p {
    margin: 20px 0 !important;
  }
  ul {
    padding: 0px;
    list-style-position: inside;
    width: 100%;
    margin: 20px 0;
    border-radius: 5px;
  }

  li {
    text-align: start;
    list-style-type: none;
    margin: 10px 0;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
`;
