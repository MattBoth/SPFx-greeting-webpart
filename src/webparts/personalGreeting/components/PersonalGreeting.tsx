import * as React from 'react';
import styles from './PersonalGreeting.module.scss';
import { IPersonalGreetingProps } from './IPersonalGreetingProps';
import { DefaultButton, Icon } from '@fluentui/react';
import { formatName } from './nameUtils';

export default class PersonalGreeting extends React.Component<IPersonalGreetingProps, {}> {
  public render(): React.ReactElement<IPersonalGreetingProps> {

    const custStyles: React.CSSProperties = {
      textAlign: this.props.position as React.CSSProperties['textAlign'],
      color: this.props.textColor,
      fontSize: this.props.fontSize,
      fontWeight: this.props.bold ? 700 : 400,
      fontStyle: this.props.italic ? 'italic' : 'normal',
      textDecoration: this.props.underline ? 'underline' : 'none'
    };

    const name = formatName(
      this.props.context.pageContext.user.displayName,
      this.props.nameMode,
      this.props.sourceFormat,
      this.props.bothOrder
    );

    return (
      <div className={ styles.personalGreeting }>
        {this.props.greetingText === undefined || this.props.greetingText === null ?
        <div className={styles.placeholder}>
          <Icon className={styles.placeholderIcon} iconName='Edit' />
          <div className={styles.placeholderTitle}>Configure the web part</div>
          <div className={styles.placeholderDescription}>Please configure the web part</div>
          <DefaultButton text='Configure' onClick={this._onConfigure} />
        </div>
        : <div className={ styles.title } style={custStyles}>{this.props.greetingText} {name}</div>
        }
      </div>
    );
  }

  private _onConfigure = (): void => {
    this.props.context.propertyPane.open();
  };

}
