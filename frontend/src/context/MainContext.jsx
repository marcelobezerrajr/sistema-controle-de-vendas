import React from 'react';
import { ClienteProvider } from './ClienteContext';
import { ComissaoProvider } from './ComissaoContext';
import { CustoProvider } from './CustoContext';
import { FornecedorProvider } from './FornecedorContext';
import { ItemVendaProvider } from './ItemVendaContext';
import { ParcelaProvider } from './ParcelaContext';
import { ProdutoProvider } from './ProdutoContext';
import { VendaProvider } from './VendaContext';
import { VendaVendedorProvider } from './VendaVendedorContext';
import { VendedorProvider } from './VendedorContext';
import { LoginProvider } from './LoginContext';
import { RequestPasswordProvider } from './RequestPasswordContext';
import { ResetPasswordProvider } from './ResetPasswordContext';
import { EntityProvider } from './EntityContext';
import { UsuarioProvider } from './UsuarioContext';

const MainProvider = ({ children }) => {
  return (
    <LoginProvider>
      <RequestPasswordProvider>
        <ResetPasswordProvider>
          <EntityProvider>
            <ClienteProvider>
              <ComissaoProvider>
                <CustoProvider>
                  <ItemVendaProvider>
                    <ParcelaProvider>
                      <ProdutoProvider>
                        <VendedorProvider>
                          <VendaProvider>
                            <UsuarioProvider>
                              <VendaVendedorProvider>
                                <FornecedorProvider>
                                  {children}
                                </FornecedorProvider>
                              </VendaVendedorProvider>
                            </UsuarioProvider>
                          </VendaProvider>
                        </VendedorProvider>
                      </ProdutoProvider>
                    </ParcelaProvider>
                  </ItemVendaProvider>
                </CustoProvider>
              </ComissaoProvider>
            </ClienteProvider>
          </EntityProvider>
        </ResetPasswordProvider>
      </RequestPasswordProvider>
    </LoginProvider>
  );
};

export { MainProvider };
